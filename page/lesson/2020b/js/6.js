(function(){

var botui = new BotUI('chat-app');

// メイン用
var message;
var log = '';
var log_all = ''; // DB用全ログ
var angry_count = 0; //最初のとこ用
var url = '../api/send_log.php?log='; // ログ保存用
var search_api = '../api/search.php?message='; // 動画検索用
var level = 0; // 理解度
var lesson = 6; // 授業回

// ishi連携
var targetScore = 0;             // 目標点数
var actualScore = 0;              // 実際の点数
var satisfaction = 0;             //学習満足度
var classDate;                    // 授業日（UNIXTIME)
var ishi_db = '../api/ishi.php';  // apiパス
// ishi_reflection
var ishi_reflection_url = '../api/ishiReflection.php?lesson=';
var result;
var reflection = '';

// 学習レポート用
var repoTimeIs;     // 学習時間
var repoStudyIs;    // eラーニング回答状況
var exam = [];      // 確認テスト点数
var reExam = [];    // 再テスト点数
var reExamCheckIs;  // 再テスト実施確認用
var correct = 0;
// var correct2 = 0; // 各テスト合計点
// var n = 1;      // 事前テスト問題カウント
// var s = 1;      // 事後テスト問題カウント
// var jizen = 5;  // 事前テスト（確認テスト）問題数
// var jigo = 5;   // 事後テスト（再テスト）問題数

// 時間がないので仮
// var test1 = test2 = test3 = test4 = test5 = test6 = test7 = 0;
// var retest1 = retest2 = retest3 = retest4 = retest5 = retest6 = retest7 = retest8 = retest9 = 0;
// var exam_url = '../api/exam_send.php';

// status update
var update_url = '../api/statusUpdate.php';

init();

// ishiのDB関数
function ishiDb(targetScore, actualScore, satisfaction, reflection){
  var date = new Date(2020, 10, 5, 0, 0, 0, 0); // 月は0~11
  classDate = date.getTime();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', ishi_db, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.send('targetScore=' + targetScore + '&actualScore=' + actualScore + '&satisfaction=' + satisfaction + '&reflection=' + reflection + '&classDate=' + classDate);
}

// ログ書き足し関数１
function addBot(log){
  log_all += '<p class="bot">' + log + '</p>';
}

// ログ書き足し関数２
function addHuman(log){
  log_all += '<p class="human">' + log + '</p>';
}

// ログDB保存関数
function send_log(lesson, level, log_all){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xhr.onload = function(){}
  xhr.send('lesson=' + lesson + '&level=' + level + '&log_all=' + log_all);
}

// テスト点数格納
function exam_check(){
  test1 = exam[0];
  test2 = exam[1];
  test3 = exam[2];
  test4 = exam[3];
  test5 = exam[4];
  // test6 = exam[5];
  // test7 = exam[6];
  if(reExamCheckIs == '受験した'){
    retest1 = reExam[0];
    retest2 = reExam[1];
    retest3 = reExam[2];
    retest4 = reExam[3];
    retest5 = reExam[4];
    // retest6 = reExam[5];
    // retest7 = reExam[6];
    // retest8 = reExam[7];
    // retest9 = reExam[8];
  }
}

function send_exam(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', exam_url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xhr.onload = function(){}
  xhr.send('test1=' + test1 + '&test2=' + test2 + '&test3=' + test3 + '&test4=' + test4 + '&test5=' + test5 + '&retest1=' + retest1 + '&retest2=' + retest2 + '&retest3=' + retest3 + '&retest4=' + retest4 + '&retest5=' + retest5);
}

function status_update(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', update_url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send('lesson=1111100000000');
}

function init(){
  botui.message.add({
    content:'こんにちは！'
  }).then(function(){
    log = 'こんにちは';
    addBot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'学習の振り返りをしよう！'
    }).then(function(){
      log = '学習の振り返りをしよう！';
      addBot(log);
      return botui.action.button({
        autoHide:false,
        delay:1000,
        action:[
          {icon:'fas fa-circle', text:'はい', value:'yes'},
          {icon:'times', text:'いいえ', value:'no'}
        ]
      }).then(function(res){
        botui.action.hide();
        switch(res.value){
          case 'yes':
            log = 'はい';
            addHuman(log);
            repoStudy();
            break;
          case 'no':
            log = 'いいえ';
            addHuman(log);
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
      log = '学習の振り返りをしよう！';
      addBot(log);
      return botui.action.button({
        autoHide:false,
        delay:1000,
        action:[
          {icon:'fas fa-circle', text:'はい', value:'yes'},
          {icon:'times', text:'いいえ', value:'no'}
        ]
      }).then(function(res){
        botui.action.hide();
        switch(res.value){
          case 'yes':
            log = 'はい';
            addHuman(log);
            repoStudy();
            break;
          case 'no':
            log = 'いいえ';
            addHuman(log);
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
      log = '早く"はい"を押して振り返りしてください（#^ω^）';
      addBot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'振り返りしますか？(*^^)'
      }).then(function(){
        log = '振り返りしますか？(*^^)';
        addBot(log);
        return botui.action.button({
          autoHide:false,
          delay:1000,
          action:[
            {icon:'fas fa-circle', text:'はい', value:'yes'},
            {icon:'times', text:'いいえ', value:'no'}
          ]
        }).then(function(res){
          botui.action.hide();
          switch(res.value){
            case 'yes':
              log = 'はい';
              addHuman(log);
              repoStudy();
              break;
            case 'no':
              log = 'いいえ';
              addHuman(log);
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
// function repoTime(){
//   botui.message.add({
//     delay:100,
//     loading:true,
//     content:'第２回の授業内容の学習に要した時間を分単位で記入してね。'
//   }).then(function(){
//     log = '第２回の授業内容の学習に要した時間を分単位で記入してね。';
//     addBot(log);
//     return botui.action.text({
//       delay:10,
//       action:{
//         placeholder:'例：60'
//       }
//     }).then(function(res){
//       addHuman(res.value);
//       repoTimeIs = res.value;
//       repoStudy();
//     });
//   });
// }

function repoStudy(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'今回の予習（eラーニング教材等）は全問回答してきましたか？'
  }).then(function(){
    log = '今回の予習（eラーニング教材等）は全問回答してきましたか？';
    addBot(log);
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'fas fa-circle', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          repoStudyIs = '全て回答した';
          addHuman(repoStudyIs);
          question();
          break;
        case 'no':
          repoStudyIs = '回答していない';
          addHuman(repoStudyIs);
          question();
          break;
        case 'undo':
          log = '戻る';
          addHuman(log);
          repoStudy();
          break;
        default:quit();
      }
    });
  });
}

function question(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の事前テストの目標点数は何点だったか選択してください。'
  }).then(function(){
    log = '今回の事前テストの目標点数は何点だったか選択してください。';
    addBot(log);
    botui.action.select({
      action:{
        placeholder:'点数を選んでね',
        value:'6',
        searchselect:true,
        label:'text',
        options:[
          {value:"0", text:"0"},
          {value:"1", text:"1"},
          {value:"2", text:"2"},
          {value:"3", text:"3"},
          {value:"4", text:"4"},
          {value:"5", text:"5"},
          {value:"6", text:"6"},
          {value:"7", text:"7"},
          {value:"8", text:"8"},
          {value:"9", text:"9"},
          {value:"10", text:"10"},
        ],
        button:{
          icon:'check',
          label:'OK'
        }
      }
    }).then(function(res){
      addHuman(res.value);
      targetScore = res.value;
      exam1();
    });
  });
}

function exam1(){
  botui.message.add({
    delay:200,
    loading:true,
    content:'今回の事前テストの点数を選択してください。'
  }).then(function(){
    log = '今回の事前テストの点数を選択してください。';
    addBot(log);
    botui.action.select({
      action:{
        placeholder:'点数を選んでね',
        value:'6',
        searchselect:true,
        label:'text',
        options:[
          {value:"0", text:"0"},
          {value:"1", text:"1"},
          {value:"2", text:"2"},
          {value:"3", text:"3"},
          {value:"4", text:"4"},
          {value:"5", text:"5"},
          {value:"6", text:"6"},
          {value:"7", text:"7"},
          {value:"8", text:"8"},
          {value:"9", text:"9"},
          {value:"10", text:"10"},
        ],
        button:{
          icon:'check',
          label:'OK'
        }
      }
    }).then(function(res){
      correct = res.value;
      repoCheck();
    });
  });
}

function repoCheck(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'回答の確認をします。'
  }).then(function(){
    log = '回答の確認をします。<br>';
      botui.message.add({
        delay:10,
        loading:true,
        content:'eラーニング回答状況：' + repoStudyIs
      }).then(function(){
        log += 'eラーニング回答状況：' + repoStudyIs + '<br>';
        botui.message.add({
          delay:10,
          loading:true,
          content:'事前テスト目標点数：' + targetScore + '点'
        }).then(function(){
          log += '事前テスト目標点数：'　+ targetScore + '点' + '<br>';
          botui.message.add({
            delay:10,
            loading:true,
            content:'事前テスト点数：' + correct + '点'
          }).then(function(){
            log += '事前テスト点数：'　+ correct + '点';
            addBot(log);
            repoEnd();
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
    log = '以上で登録しますか？';
    addBot(log);
    return botui.action.button({
      autoHide:false,
      delay:10,
      action:[
        {icon:'fas fa-circle', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ（回答し直す）', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          log = 'はい';
          addHuman(log);
          actualScore = correct;
          botui.message.add({
            delay:1000,
            loading:true,
            content:'続けて、学習の理解に対する振り返りを行います。'
          }).then(function(){
            log = '続けて、学習の理解に対する振り返りを行います。';
            addBot(log);
            question1();
          });
          break;
        case 'no':
          log = 'いいえ（回答し直す）';
          addHuman(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'最初から回答をやり直します。'
          }).then(function(){
            log = '最初から回答をやり直します。';
            addBot(log);
            exam.length = 0;
            reExam.length = 0;
            repoStudy();
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
    log = '今回の学習満足度を選択してください。';
    addBot(log);
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
        addHuman(log);
      }else if(res.value == 25){
        log = 'あまり満足していない';
        addHuman(log);
      }else if(res.value == 50){
        log = 'どちらともいえない';
        addHuman(log);
      }else if(res.value == 75){
        log = 'まあ満足している';
        addHuman(log);
      }else{
        log = '非常に満足している';
        addHuman(log);
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
    content:'今回の学習内容の理解度を選択してください。'
  }).then(function(){
    log = '今回の学習内容の理解度を選択してください。';
    addBot(log);
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
        log = '"全く理解ができていない';
        addHuman(log);
      }else if(res.value == 1){
        log = 'まだ分からない箇所が多く不安である';
        addHuman(log);
      }else if(res.value == 2){
        log = '少し理解しているが、曖昧な箇所もありどちらともいえない';
        addHuman(log);
      }else if(res.value == 3){
        log = '概ね理解しており、不安が少ない';
        addHuman(log);
      }else{
        log = 'すべての範囲について完璧に理解している';
        addHuman(log);
      }

      // 学習満足度の代入
      level = res.value;

      test_question();

    });
  });
}

function test_question(){
  if(correct < 10){
    questionBad();
  }else{
    question3();
  }
}

function questionBad(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の事前テストでは満点を取れていません。'
  }).then(function(){
    log = '今回の事前テストでは満点を取れていません。<br>';
    botui.message.add({
      delay:1000,
      loading:true,
      content:'満点を取れなかった理由について下記から選択してください。（複数ある場合は一番近いものを選んでください。）'
    }).then(function(){
      log += '満点を取れなかった理由について下記から選択してください。（複数ある場合は一番近いものを選んでください。）';
      addBot(log);
      return botui.action.button({
        autoHide:false,
        delay:1000,
        action:[
          {text:'計算ミス', value:'計算ミス'},
          {text:'時間が足りなかった', value:'時間が足りなかった'},
          {text:'予習不足であった', value:'予習不足であった'},
          {text:'理解が足りていなかった', value:'理解が足りていなかった'}
        ]
      }).then(function(res){
        botui.action.hide();
        log = res.value;
        addHuman(log);
        switch(res.value){
          case '計算ミス':
            question3();
            break;
          case '時間が足りなかった':
            question3();
            break;
          case '予習不足であった':
            question4();
            break;
          case '理解が足りていなかった':
            question4();
            break;
          default:quit();
        }
      });
    });
  });
}

function question3(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'これまで学習してきた内容で、まだ理解ができていないと感じる箇所はありますか？（確認テストやeラーニングで不正解だった部分を理解しきれていない部分がありますか？）'
  }).then(function(){
    log = 'これまで学習してきた内容で、まだ理解ができていないと感じる箇所はありますか？（確認テストやeラーニングで不正解だった部分を理解しきれていない部分がありますか？）';
    addBot(log);
    return botui.action.button({
      autoHide:false,
      delay:1000,
      action:[
        {icon:'fas fa-circle', text:'ある', value:'yes'},
        {icon:'times', text:'ない', value:'no'}
      ]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          log = 'ある';
          addHuman(log);
          question4();
          break;
        case 'no':
          log = 'ない';
          addHuman(log);
          ref1();
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
    content:'今回の学習内容で理解が不足していると感じる点について、例を参考にし具体的に書いてみてください。'
  }).then(function(){
    log = '今回の学習内容で理解が不足していると感じる点について、例を参考にし具体的に書いてみてください。';
    addBot(log);
    return botui.action.text({
      delay:1000,
      loading:true,
      action:{placeholder:'例:eラーニング◯問目の，n=k+1の計算方法がよく分からない．'}
    }).then(function(res){
      addHuman(res.value);
      search(res.value);
    });
  });
}

function search(message){
  if((message.indexOf('順列') != -1) && (message.indexOf('同じもの') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'同じものを含む順列に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '同じものを含む順列に関する補足説明動画が見つかりました！<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log += '動画を見ることで理解できるかもしれないので，見てみてください！<br>';
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/HN_eJBSFsjs'
        }).then(function(){
          log += 'https://www.youtube.com/embed/HN_eJBSFsjs<br>';
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log += '動画を見終わったらボタンを押してください．';
            addBot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'fas fa-circle', text:'次へ', value:'next'}
              ]
            }).then(function(res){
              log = '次へ';
              addHuman(log);
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
  }else if((message.indexOf('組み合わせ') != -1) || (message.indexOf('組合せ') != -1) || (message.indexOf('組み合せ') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'組合せ(nCr)に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '組合せ(nCr)に関する補足説明動画が見つかりました！<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log += '動画を見ることで理解できるかもしれないので，見てみてください！<br>';
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/3Wnl0KWfG5c'
        }).then(function(){
          log += 'https://www.youtube.com/embed/3Wnl0KWfG5c<br>';
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log += '動画を見終わったらボタンを押してください．<br>';
            addBot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'fas fa-circle', text:'次へ', value:'next'}
              ]
            }).then(function(res){
              log = '次へ';
              addHuman(log);
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
  }else if(message.indexOf('重複') != -1){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'重複組合せに関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '重複組合せに関する補足説明動画が見つかりました！<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log += '動画を見ることで理解できるかもしれないので，見てみてください！<br>';
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/3yECPH9vv1k'
        }).then(function(){
          log += 'https://www.youtube.com/embed/3yECPH9vv1k<br>';
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log += '動画を見終わったらボタンを押してください．<br>';
            addBot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'fas fa-circle', text:'次へ', value:'next'}
              ]
            }).then(function(res){
              log = '次へ';
              addHuman(log);
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
  }else if(message.indexOf('二項定理') != -1){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'二項定理に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '二項定理に関する補足説明動画が見つかりました！<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log += '動画を見ることで理解できるかもしれないので，見てみてください！<br>';
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/G6HBZuRr-p8'
        }).then(function(){
          log += 'https://www.youtube.com/embed/G6HBZuRr-p8<br>';
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log += '動画を見終わったらボタンを押してください．<br>';
            addBot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'fas fa-circle', text:'次へ', value:'next'}
              ]
            }).then(function(res){
              log = '次へ';
              addHuman(log);
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
  }else if(message.indexOf('多項定理') != -1){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'二多項定理に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '多項定理に関する補足説明動画が見つかりました！<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log += '動画を見ることで理解できるかもしれないので，見てみてください！<br>';
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/uHvkaVk5yJk'
        }).then(function(){
          log += 'https://www.youtube.com/embed/uHvkaVk5yJk<br>';
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log += '動画を見終わったらボタンを押してください．<br>';
            addBot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'fas fa-circle', text:'次へ', value:'next'}
              ]
            }).then(function(res){
              log = '次へ';
              addHuman(log);
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
  }else if(message.indexOf('なし') != -1){
    ref1();
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
    log = '送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？';
    addBot(log);
    return botui.action.button({
      autoHide:false,
      delay:1000,
      action:[
        {icon:'fas fa-circle', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}]
    });
  }).then(function(res){
    botui.action.hide();
    switch (res.value){
      case 'yes':
        log = 'はい';
        addHuman(log);
        mvgood();
        break;
      case 'no':
        log = 'いいえ';
        addHuman(log);
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
    log = 'ありがとうございます！<br>';
    botui.message.add({
      delay:1000,
      loading:true,
      content:'特に役に立った部分を教えてください！'
    }).then(function(){
      log += '特に役に立った部分を教えてください！<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，役に立った内容の動画時間など何でも構いません！'
      }).then(function(){
        log += '説明方法や，役に立った内容の動画時間など何でも構いません！<br>';
        botui.message.add({
          delay:1000,
          loading:true,
          content:'改善してほしい点もあれば加えて記入してください！'
        }).then(function(){
          log += '改善してほしい点もあれば加えて記入してください！<br>';
          addBot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりやすかった．'
            }
          }).then(function(res){
            addHuman(res.value);
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
    log = 'ごめんなさい・・・<br>';
    botui.message.add({
      delay:1000,
      loading:true,
      content:'良ければ改善点を教えてください！'
    }).then(function(){
      log += '良ければ改善点を教えてください！<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，分かりにくかった内容の動画時間など何でも構いません．'
      }).then(function(){
        log += '説明方法や，分かりにくかった内容の動画時間など何でも構いません．<br>';
        botui.message.add({
          delay:1000,
          loading:true,
          content:'よろしくお願いします！'
        }).then(function(){
          log += 'よろしくお願いします！';
          addBot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりにくい．〇〇のような説明を求めます．'
            }
          }).then(function(res){
            addHuman(res.value);
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
    log = 'ロボットでは具体的な解決方法が見つけられませんでした・・・<br>';
    botui.message.add({
      delay:1000,
      loading:true,
      content:'TAやSAからどのような説明があれば理解できそうですか？'
    }).then(function(){
      log += 'TAやSAからどのような説明があれば理解できそうですか？<br>';
      botui.message.add({
        delay:1000,
        loading:true,
        content:'下記から選択してください．'
      }).then(function(){
        log += '下記から選択してください．';
        addBot(log);
        //ボタンを提示
        return botui.action.button({
          autoHide:false,
          delay:1000,
          loading:true,
          action:[
            {icon:'superscript', text:'公式の説明', value:'公式の説明'},
            {icon:'question', text:'例題を用いて説明', value:'例題を用いて説明'},
            {icon:'pencil', text:'その他（自由記述）', value:'その他（自由記述）'}
          ]
        }).then(function(res){
          addHuman(res.value);
          botui.action.hide();
          if(res.value == '公式の説明'){
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！';
              addBot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                addHuman(res.value);
                question5();
              });
            });
          }else if(res.value == '例題を用いて説明'){
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！';
              addBot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                addHuman(res.value);
                question5();
              });
            });
          }else if(res.value == 'その他（自由記述）'){
            botui.message.add({
              delay: 1500,
              loading:true,
              content: 'どのような説明方法を希望しますか？具体的に書いてみてください。'
            }).then(function(){
              log = 'どのような説明方法を希望しますか？具体的に書いてみてください。';
              addBot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                addHuman(res.value);
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
    log = '他に分からないと感じている箇所はありますか？';
    addBot(log);
    return botui.action.button({
      autoHide:false,
      delay:1500,
      loading:true,
      action:[
        {icon:'fas fa-circle', text:'ある', value:'yes'},
        {icon:'times', text:'ない', value:'no'}]
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          log = 'ある';
          addHuman(log);
          question4();
          break;
        case 'no':
          log = 'ない';
          addHuman(log);
          ref1();
          break;
        default:quit();
      }
    });
  });
}

function ref1(){
  botui.message.add({
    delay:500,
    loading:true,
    content:'次に学習計画について振り返りを行います。'
  }).then(function(){
    log = '次に学習計画について振り返りを行います。';
    addBot(log);
    ishi_reflection();
  });
}

function ishi_reflection(){
  var request = new XMLHttpRequest();
  request.open('GET', ishi_reflection_url + lesson);
  request.onload = function(){
    result = JSON.parse(request.responseText);
    ishi_reflection2(result.executing);
  }
  request.send();
}

function ishi_reflection2(executing){
  botui.message.add({
    delay:500,
    loading:true,
    content:'あなたの第６回授業の計画実施率は' + executing + '%でした。'
  }).then(function(){
    log = 'あなたの第６回授業の計画実施率は' + executing + '%でした。';
    addBot(log);
    botui.message.add({
      delay:500,
      loading:true,
      content:'これまでの学習計画や学習記録の内容から、学習計画に関して良かった点や今後学習計画を立てる上で気をつけたい点などを記入してください。'
    }).then(function(){
      log = 'これまでの学習計画や学習記録の内容から、学習計画に関して良かった点や今後学習計画を立てる上で気をつけたい点などを記入してください。';
      addBot(log);
      return botui.action.text({
        delay:500,
        loading:true,
        action:{placeholder:'記入してください。'}
      }).then(function(res){
        addHuman(res.value);
        reflection = res.value;
        question6();
      });
    });
  });
}

function question6(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'授業やシステムについて，意見はありますか？'
  }).then(function(){
    log = '授業やシステムについて，意見はありますか？';
    addBot(log);
    return botui.action.button({
      autoHide:false,
      delay:1500,
      loading:true,
      action:[
        {icon:'fas fa-circle', text:'ある', value:'yes'},
        {icon:'times', text:'ない', value:'no'}]
    }).then(function(res){
      botui.action.hide();
      if(res.value == 'yes'){
        log = 'ある';
        addHuman(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'自由に記述してください．'
        }).then(function(){
          log = '自由に記述してください．';
          addBot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'自由記述'
            }
          }).then(function(res){
            addHuman(res.value);
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
  botui.message.add({
    delay:1000,
    loading:true,
    content:'振り返りお疲れ様でした！'
  }).then(function(){
    log = '振り返りお疲れ様でした！';
    addBot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'次回もよろしくお願いします！'
    }).then(function(){
      log = '次回もよろしくお願いします！';
      addBot(log);
      ishiDb(targetScore, actualScore, satisfaction, reflection);
      send_log(lesson, level, log_all);
      status_update();
      // exam_check();
      // send_exam();
        botui.message.add({
          delay:1000,
          loading:true,
          content:'[ココを押して振り返り終了](https://tkg-lab.tk/g031o008/plan/view/main/)'
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
      content:'[ここを押して前のページに戻る](https://tkg-lab.tk/g031o008/plan/view/main/)'
    });
  });
}

})();
