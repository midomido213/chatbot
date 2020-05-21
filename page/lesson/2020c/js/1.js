(function(){

var botui = new BotUI('chat-app');

var message;
var log = '';
var log_all = ''; // DB用全ログ
var log_bot = ''; // DB用ボットログ
var log_human = ''; // DB用人間ログ
var angry_count = 0; //最初のとこ用
var url = '../api/send_log.php?log='; // テキストログ保存用
var search_api = '../api/search.php?message=';
var send_db_url = '../api/send_log_db.php?';


// ishi連携
var targetScore = 10;             // 目標点数
var actualScore = 0;              // 実際の点数
var satisfaction = 0;             //学習満足度
var ishi_db = '../api/ishi.php';  // apiパス

var level = 0;
var lesson = 113;

// 学習レポート用
var repoTimeIs;     // 学習時間
var repoStudyIs;    // eラーニング回答状況
var exam = [];      // 確認テスト点数
var reExam = [];    // 再テスト点数
var reExamCheckIs;  // 再テスト実施確認用

var correct, correct2;

init();

// ishiのDB関数
function ishiDb(targetScore, actualScore, satisfaction){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', ishi_db, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.send('targetScore=' + targetScore + '&actualScore=' + actualScore + '&satisfaction=' + satisfaction);
}

// ログ書き足し関数１
function add_log_bot(log){
  log_all += '<p class="bot">' + log + '</p>';
  log_bot += log;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url + log);
  xhr.onload = function(){}
  xhr.send();
}

// ログ書き足し関数２
function add_log_human(log){
  log_all += '<p class="human">' + log + '</p>';
  log_human += log;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url + log);
  xhr.onload = function(){}
  xhr.send();
}

// ログDB保存関数
function send_log_final(lesson, level, log_all, log_bot, log_human){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', send_db_url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xhr.onload = function(){}
  xhr.send('lesson=' + lesson + '&level=' + level + '&log_all=' + log_all + '&log_bot=' + log_bot + '&log_human=' + log_human);
}


function init(){
  botui.message.add({
    content:'こんにちは！'
  }).then(function(){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'学習の振り返りをしよう！'
    }).then(function(){
      return botui.action.button({
        autoHide:false,
        delay:1000,
        action:[
          {icon:'circle-thin', text:'はい', value:'yes'},
          {icon:'times', text:'いいえ', value:'no'}
        ]
      }).then(function(res){
        botui.action.hide();
        switch(res.value){
          case 'yes':
            repoTime();
            break;
          case 'no':
            angry();
            break;
          default:quit();
        }
      });
    });
  });
}

function angry(){
  angry_count += 1;
  if(angry_count < 3){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'学習の振り返りをしよう！'
    }).then(function(){
      return botui.action.button({
        autoHide:false,
        delay:1000,
        action:[
          {icon:'circle-thin', text:'はい', value:'yes'},
          {icon:'times', text:'いいえ', value:'no'}
        ]
      }).then(function(res){
        botui.action.hide();
        switch(res.value){
          case 'yes':
            repoTime();
            break;
          case 'no':
            angry();
            break;
          default:quit();
        }
      });
    });
  }else{
    botui.message.add({
      delay:1000,
      loading:true,
      content:'早く"はい"を押して振り返りしてください（#^ω^）'
    }).then(function(){
      botui.message.add({
        delay:1000,
        loading:true,
        content:'振り返りしますか？(*^^)'
      }).then(function(){
        return botui.action.button({
          autoHide:false,
          delay:1000,
          action:[
            {icon:'circle-thin', text:'はい', value:'yes'},
            {icon:'times', text:'いいえ', value:'no'}
          ]
        }).then(function(res){
          botui.action.hide();
          switch(res.value){
            case 'yes':
              repoTime();
              break;
            case 'no':
              angry();
              break;
            default:quit();
          }
        });
      });
    });
  }
}

//学習レポートの内容
function repoTime(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'第１回の授業内容の学習に要した時間を分単位で記入してね。'
  }).then(function(){
    return botui.action.text({
      delay:10,
      action:{
        placeholder:'例：〇〇〇分'
      }
    }).then(function(res){
      repoTimeIs = res.value;
      repoStudy();
    });
  });
}

function repoStudy(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'eラーニング教材の第１回演習問題(23問)を全て回答しましたか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'},
        {icon:'undo', text:'戻る', value:'undo'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          repoStudyIs = '全て回答した';
          exam1();
          break;
        case 'no':
          repoStudyIs = '回答していない';
          exam1();
          break;
        case 'undo':
          repoTime();
          break;
        default:quit();
      }
    });
  });
}

function exam1(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'確認テスト第１問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          exam.push(1);
          exam2();
          break;
        case 'no':
          exam.push(0);
          exam2();
          break;
        default:quit();
      }
    });
  });
}

function exam2(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'確認テスト第２問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          exam.push(1);
          exam3();
          break;
        case 'no':
          exam.push(0);
          exam3();
          break;
        default:quit();
      }
    });
  });
}

function exam3(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'確認テスト第２問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          exam.push(1);
          exam4();
          break;
        case 'no':
          exam.push(0);
          exam4();
          break;
        default:quit();
      }
    });
  });
}

function exam4(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'確認テスト第３問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          exam.push(1);
          exam5();
          break;
        case 'no':
          exam.push(0);
          exam5();
          break;
        default:quit();
      }
    });
  });
}

function exam5(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'確認テスト第４問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          exam.push(2);
          exam6();
          break;
        case 'no':
          exam.push(0);
          exam6();
          break;
        default:quit();
      }
    });
  });
}

function exam6(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'確認テスト第４問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          exam.push(2);
          exam7();
          break;
        case 'no':
          exam.push(0);
          exam7();
          break;
        default:quit();
      }
    });
  });
}

function exam7(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'確認テスト第４問（３）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          exam.push(2);
          reExamCheck();
          break;
        case 'no':
          exam.push(0);
          reExamCheck();
          break;
        default:quit();
      }
    });
  });
}

function reExamCheck(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テストは受験しましたか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExamCheckIs = '受験した';
          reExam1();
          break;
        case 'no':
          reExamCheckIs = '受験していない';
          repoCheck();
          break;
        default:quit();
      }
    });
  });
}

function reExam1(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第１問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExam.push(1);
          reExam2();
          break;
        case 'no':
          reExam.push(0);
          reExam2();
          break;
        default:quit();
      }
    });
  });
}

function reExam2(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第２問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExam.push(1);
          reExam3();
          break;
        case 'no':
          reExam.push(0);
          reExam3();
          break;
        default:quit();
      }
    });
  });
}

function reExam3(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第２問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExam.push(1);
          reExam4();
          break;
        case 'no':
          reExam.push(0);
          reExam4();
          break;
        default:quit();
      }
    });
  });
}

function reExam4(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第３問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExam.push(1);
          reExam5();
          break;
        case 'no':
          reExam.push(0);
          reExam5();
          break;
        default:quit();
      }
    });
  });
}

function reExam5(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第４問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExam.push(2);
          reExam6();
          break;
        case 'no':
          reExam.push(0);
          reExam6();
          break;
        default:quit();
      }
    });
  });
}

function reExam6(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第４問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExam.push(2);
          reExam7();
          break;
        case 'no':
          reExam.push(0);
          reExam7();
          break;
        default:quit();
      }
    });
  });
}

function reExam7(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第５問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'正解', value:'yes'},
        {icon:'times', text:'不正解', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          reExam.push(2);
          repoCheck();
          break;
        case 'no':
          reExam.push(0);
          repoCheck();
          break;
        default:quit();
      }
    });
  });
}

function repoCheck(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'回答の確認をします。'
  }).then(function(){
    botui.message.add({
      delay:10,
      loading:true,
      content:'学習時間：' + repoTimeIs
    }).then(function(){
      botui.message.add({
        delay:10,
        loading:true,
        content:'eラーニング回答状況：' + repoStudyIs
      }).then(function(){
        correct = exam.reduce((a, x) => a+=x, 0);
        botui.message.add({
          delay:10,
          loading:true,
          content:'確認テスト合計点数：' + correct + '点'
        }).then(function(){
          if(reExamCheckIs == '受験した'){
            botui.message.add({
              delay:10,
              loading:true,
              content:'再テスト：' + reExamCheckIs
            }).then(function(){
              correct2 = reExam.reduce((a, x) => a+=x, 0);
              botui.message.add({
                delay:10,
                loading:true,
                content:'再テスト合計点数：' + correct2 + '点'
              }).then(function(){
                repoEnd();
              });
            });
          }else{
            botui.message.add({
              delay:10,
              loading:true,
              content:'再テスト：' + reExamCheckIs
            }).then(function(){
              repoEnd();
            });
          }
        });
      });
    });
  });
}

function repoEnd(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'以上で登録しますか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ（回答し直す）', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          testScore = correct;
          botui.message.add({
            delay:1000,
            loading:true,
            content:'続けて、学習の理解に対する振り返りを行います。'
          }).then(function(){
            question1();
          });
          break;
        case 'no':
          botui.message.add({
            delay:1000,
            loading:true,
            content:'最初から回答をやり直します。'
          }).then(function(){
            exam.length = 0;
            reExam.length = 0;
            repoTime();
          });
          break;
      }
    });
  });
}

function question1(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の学習満足度を選択してください。'
  }).then(function(){
    botui.action.select({
      action:{
        placeholder:'学習満足度を選択',
        value:'0',
        searchselect:true,
        label:'text',
        options:[
          {value:"0", text:"全く満足していない"},
          {value:"25", text:"あまり満足していない"},
          {value:"50", text:"どちらともいえない"},
          {value:"75", text:"まあ満足している"},
          {value:"100", text:"非常に満足している"}
        ],
        button:{
          icon:'check',
          label:'OK'
        }
      }
    }).then(function(res){
      if(res.value == 0){
      }else if(res.value == 25){
      }else if(res.value == 50){
      }else if(res.value == 75){
      }else{
      }

      // 学習満足度の代入
      satisfaction = res.value;

      question2();

    });
  });
}

function question2(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の学習理解度を選択してください。'
  }).then(function(){
    botui.action.select({
      action:{
        placeholder:'学習満足度を選択',
        value:'0',
        searchselect:true,
        label:'text',
        options:[
          {value:"0", text:"全く理解ができていない"},
          {value:"1", text:"まだ分からない箇所が多く不安である"},
          {value:"2", text:"少し理解しているが、曖昧な箇所もありどちらともいえない"},
          {value:"3", text:"概ね理解しており、不安が少ない"},
          {value:"4", text:"今回の範囲に関しては完璧に理解している"}
        ],
        button:{
          icon:'check',
          label:'OK'
        }
      }
    }).then(function(res){
      if(res.value == 0){
      }else if(res.value == 1){
      }else if(res.value == 2){
      }else if(res.value == 3){
      }else{
      }

      // 学習満足度の代入
      level = res.value;

      question3();

    });
  });
}

function question3(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回学習した「命題論理・集合①」の中で、まだ理解ができていないと感じる箇所はありますか？（確認テストやeラーニングで不正解だった部分を理解しきれていない部分がありますか？）'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
      action:[
        {icon:'circle-thin', text:'ある', value:'yes'},
        {icon:'times', text:'ない', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          question4();
          break;
        case 'no':
          question5();
          break;
        default:quit();
      }
    });
  });
}

function question4(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'感じている箇所はどんなところですか？できるだけ具体的に書いてみてください。'
  }).then(function(){
    return botui.action.text({
      delay:1000,
      loading:true,
      action:{placeholder:'例:eラーニング◯問目の，n=k+1の計算方法がよく分からない．'}
    }).then(function(res){
      search(res.value);
    });
  });
}

function search(message){
  if((message.indexOf('必要条件') != -1) || (message.indexOf('十分条件') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'命題と条件　命題の真偽,必要条件・十分条件に関する補足説明動画が見つかりました！'
    }).then(function(){
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/E99EgJ5F2Zk'
        }).then(function(){
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'circle-thin', text:'次へ', value:'next'}
              ]
            }).then(function(res){
              botui.action.hide();
              switch(res.value){
                case 'next':
                  movie_question();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('逆') != -1) || (message.indexOf('裏') != -1)　|| (message.indexOf('対偶') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'命題と条件　逆・裏・対偶に関する補足説明動画が見つかりました！'
    }).then(function(){
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/hKFF1_h-PtM'
        }).then(function(){
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'circle-thin', text:'次へ', value:'next'}
              ]
            }).then(function(res){
              botui.action.hide();
              switch(res.value){
                case 'next':
                  movie_question();
                  break;
              }
            });
          });
        });
      });
    });
  }else{
    no_movie();
  }
}

function movie_question(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}]
    });
  }).then(function(res){
    botui.action.hide();
    switch (res.value){
      case 'yes':
        mvgood();
        break;
      case 'no':
        mvbad();
        break;
      default:quit();
    }
  });
}

// 動画良い感想
function mvgood(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'ありがとうございます！'
  }).then(function(){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'特に役に立った部分を教えてください！'
    }).then(function(){
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，役に立った内容の動画時間など何でも構いません！'
      }).then(function(){
        botui.message.add({
          delay:1000,
          loading:true,
          content:'改善してほしい点もあれば加えて記入してください！'
        }).then(function(){
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりやすかった．'
            }
          }).then(function(res){
            question5();
          });
        });
      });
    });
  });
}

// 動画悪い感想
function mvbad(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'ごめんなさい・・・'
  }).then(function(){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'良ければ改善点を教えてください！'
    }).then(function(){
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，分かりにくかった内容の動画時間など何でも構いません．'
      }).then(function(){
        botui.message.add({
          delay:1000,
          loading:true,
          content:'よろしくお願いします！'
        }).then(function(){
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりにくい．〇〇のような説明を求めます．'
            }
          }).then(function(res){
            question5();
          });
        });
      });
    });
  });
}

// 動画なし
function no_movie(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'ロボットでは具体的な解決方法が見つけられませんでした・・・'
  }).then(function(){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'どのような説明があれば理解できそうですか？'
    }).then(function(){
      botui.message.add({
        delay:1000,
        loading:true,
        content:'下記から選択してください．'
      }).then(function(){
        //ボタンを提示
        return botui.action.button({
          autoHide:false,
          delay:1000,
          loading:true,
          action:[
            {icon:'superscript', text:'公式の説明', value:'1'},
            {icon:'question', text:'例題を用いて説明', value:'2'},
            {icon:'pencil', text:'その他（自由記述）', value:'3'}
          ]
        }).then(function(res){
          botui.action.hide();
          if(res.value == '1'){
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                question5();
              });
            });
          }else if(res.value == '2'){
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                question5();
              });
            });
          }else if(res.value == '3'){
            botui.message.add({
              delay: 1500,
              loading:true,
              content: 'どのような説明方法を希望しますか？具体的に書いてみてください。'
            }).then(function(){
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                question5();
              });
            });
          }else{
            quit();
          }
        });
      });
    });
  });
}

function question5(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'他に分からないと感じている箇所はありますか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1500,
      loading:true,
      action:[
        {icon:'circle-thin', text:'ある', value:'yes'},
        {icon:'times', text:'ない', value:'no'}]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          question4();
          break;
        case 'no':
          question6();
          break;
        default:quit();
      }
    });
  });
}

function question6(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'授業やシステムについて，意見はありますか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1500,
      loading:true,
      action:[
        {icon:'circle-thin', text:'ある', value:'yes'},
        {icon:'times', text:'ない', value:'no'}]
    }).then(function(res){
      botui.action.hide();
      if(res.value == 'yes'){
        botui.message.add({
          delay:1000,
          loading:true,
          content:'自由に記述してください．'
        }).then(function(){
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'自由記述'
            }
          }).then(function(res){
            end();
          });
        });
      }else{
        end();
      }
    });
  });
}

// 振り返り終了
function end(){
  ishiDb(targetScore, actualScore, satisfaction);
  send_log_final(lesson, level, log_all, log_bot, log_human);
  botui.message.add({
    delay:1000,
    loading:true,
    content:'振り返りお疲れ様でした！'
  }).then(function(){
    log = '振り返りお疲れ様でした！';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'次回の振り返り時もお待ちしてます！'
    }).then(function(){
        botui.message.add({
          delay:1000,
          loading:true,
          content:'[ココを押して振り返り終了](https://takagi-lab.tk/g031o008/plan/view/main/)'
      });
    });
  });
}

// エラー
function quit(){
  botui.message.add({
    content:'何らかのエラーが発生しました．やり直してください．'
  }).then(function(){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'[ここを押して前のページに戻る](https://takagi-lab.tk/g031o008/plan/view/main/)'
    });
  });
}

})();
