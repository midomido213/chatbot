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
var yuki_db_url = '../api/yuki_db.php';
var ishi_db = '../api/ishi.php';
var targetScore = 0;
var actualScore = 0;
var freeDescription = '';
var satisfaction = 0;
var level = 0;
var lesson = 113;

var repoTimeIs;
var repoStudyIs;
var exam = [];
var reExam = [];
// var exam1, exam2, exam3, exam4, exam5, exam6, exam7;
var reExamCheckIs;
// var reExam1, reExam2, reExam3, reExam4, reExam5, reExam6, reExam7;

init();

// 足し算
var sum  = function(arr) {
    var sum = 0;
    arr.forEach(function(elm) {
        sum += elm;
    });
    return sum;
};

// yukiのDB関数
function yukiDb(targetScore, actualScore, freeDescription){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', yuki_db_url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.send('lesson=' + lesson + '&targetScore=' + targetScore + '&actualScore=' + actualScore + '&freeDescription=' + freeDescription);
}

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
    delay:1000,
    loading:true,
    content:'第１回の授業内容の学習に要した時間を記入してね。'
  }).then(function(){
    return botui.action.text({
      delay:1000,
      action:{
        placeholder:'例：◯◯時間〇〇分'
      }
    }).then(function(res){
      repoTimeIs = res.value;
      repoStudy();
    });
  });
}

function repoStudy(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'eラーニング教材の第１回演習問題(23問)を全て回答しましたか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'確認テスト第１問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
   var exam = [];
  botui.message.add({
    delay:1000,
    loading:true,
    content:'確認テスト第２問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'確認テスト第２問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'確認テスト第３問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'確認テスト第４問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'確認テスト第４問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'確認テスト第４問（３）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'再テストは受験しましたか？'
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
  var reExam = [];
  botui.message.add({
    delay:1000,
    loading:true,
    content:'再テスト第１問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'再テスト第２問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'再テスト第２問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'再テスト第３問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'再テスト第４問（１）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'再テスト第４問（２）の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'再テスト第５問の自己採点結果を選択してください。'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
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
    delay:1000,
    loading:true,
    content:'回答の確認をします。'
  }).then(function(){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'学習時間：' + repoTimeIs
    }).then(function(){
      botui.message.add({
        delay:1000,
        loading:true,
        content:'eラーニング回答状況：' + repoStudyIs
      }).then(function(){
        var correct = exam.reduce((a, x) => a+=x, 0);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'確認テスト合計点数：' + correct + '点'
        }).then(function(){
          if(reExamCheck == '受験した'){
            botui.message.add({
              delay:1000,
              loading:true,
              content:'再テスト：' + reExamCheckIs
            }).then(function(){
              var correct2 = reExam.reduce((a, x) => a+=x, 0);
              botui.message.add({
                delay:1000,
                loading:true,
                content:'再テスト合計点数：' + correct2 + '点'
              }).then(function(){
                repoEnd();
              });
            });
          }else{
            botui.message.add({
              delay:1000,
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
    delay:1000,
    loading:true,
    content:'以上で登録しますか？'
  }).then(function(){
    return botui.action.button({
      autoHide:false,
      delay:1000,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ（回答し直す）', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
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
        log = '全く満足していない';
        add_log_human(log);
      }else if(res.value == 25){
        log = 'あまり満足していない';
        add_log_human(log);
      }else if(res.value == 50){
        log = 'どちらともいえない';
        add_log_human(log);
      }else if(res.value == 75){
        log = 'まあ満足している';
        add_log_human(log);
      }else{
        log = '非常に満足している';
        add_log_human(log);
      }

      satisfaction = res.value;
      ishiDb(targetScore, actualScore, satisfaction);

      if(actualScore < 10){
        question3();
      }else{
        question2();
      }
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
