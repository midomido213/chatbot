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
var lesson = 2; // 授業回

// ishi連携
var targetScore = 0;             // 目標点数
var actualScore = 0;              // 実際の点数
var satisfaction = 0;             //学習満足度
var ishi_db = '../api/ishi.php';  // apiパス

// 学習レポート用
var repoTimeIs;     // 学習時間
var repoStudyIs;    // eラーニング回答状況
var exam = [];      // 確認テスト点数
var reExam = [];    // 再テスト点数
var reExamCheckIs;  // 再テスト実施確認用
var correct, correct2; // 各テスト合計点

// 時間がないので仮
var test1 = test2 = test3 = test4 = test5 = test6 = test7 = 0;
var retest1 = retest2 = retest3 = retest4 = retest5 = retest6 = retest7 = retest8 = retest9 = 0;
var exam_url = '../api/exam_send.php';

init();

// ishiのDB関数
function ishiDb(targetScore, actualScore, satisfaction){
  var date = new Date(2020, 4, 29, 0, 0, 0); // 月は0~11
  classDate = date.getTime();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', ishi_db, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.send('targetScore=' + targetScore + '&actualScore=' + actualScore + '&satisfaction=' + satisfaction + '&classDate=' + classDate);
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
  test6 = exam[5];
  // test7 = exam[6];
  if(reExamCheckIs == '受験した'){
    retest1 = reExam[0];
    retest2 = reExam[1];
    retest3 = reExam[2];
    retest4 = reExam[3];
    retest5 = reExam[4];
    retest6 = reExam[5];
    retest7 = reExam[6];
    retest8 = reExam[7];
    retest9 = reExam[8];
  }
}

function send_exam(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', exam_url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xhr.onload = function(){}
  xhr.send('test1=' + test1 + '&test2=' + test2 + '&test3=' + test3 + '&test4=' + test4 + '&test5=' + test5 + '&test6=' + test6 + '&test7=' + test7 + '&retest1=' + retest1 + '&retest2=' + retest2 + '&retest3=' + retest3 + '&retest4=' + retest4 + '&retest5=' + retest5 + '&retest6=' + retest6 + '&retest7=' + retest7 + '&retest8=' + retest8 + '&retest9=' + retest9);
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
          {icon:'circle-thin', text:'はい', value:'yes'},
          {icon:'times', text:'いいえ', value:'no'}
        ]
      }).then(function(res){
        botui.action.hide();
        switch(res.value){
          case 'yes':
            log = 'はい';
            addHuman(log);
            repoTime();
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
          {icon:'circle-thin', text:'はい', value:'yes'},
          {icon:'times', text:'いいえ', value:'no'}
        ]
      }).then(function(res){
        botui.action.hide();
        switch(res.value){
          case 'yes':
            log = 'はい';
            addHuman(log);
            repoTime();
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
            {icon:'circle-thin', text:'はい', value:'yes'},
            {icon:'times', text:'いいえ', value:'no'}
          ]
        }).then(function(res){
          botui.action.hide();
          switch(res.value){
            case 'yes':
              log = 'はい';
              addHuman(log);
              repoTime();
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
function repoTime(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'第２回の授業内容の学習に要した時間を分単位で記入してね。'
  }).then(function(){
    log = '第２回の授業内容の学習に要した時間を分単位で記入してね。';
    addBot(log);
    return botui.action.text({
      delay:10,
      action:{
        placeholder:'例：◯◯分'
      }
    }).then(function(res){
      addHuman(res.value);
      repoTimeIs = res.value;
      repoStudy();
    });
  });
}

function repoStudy(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'eラーニング教材の第２回演習問題(24問)を全て回答しましたか？'
  }).then(function(){
    log = 'eラーニング教材の第２回演習問題(24問)を全て回答しましたか？';
    addBot(log);
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
          addHuman(repoStudyIs);
          exam1();
          break;
        case 'no':
          repoStudyIs = '回答していない';
          addHuman(repoStudyIs);
          exam1();
          break;
        case 'undo':
          log = '戻る';
          addHuman(log);
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
    content:'確認テスト第１問（１）の自己採点結果を選択してください。'
  }).then(function(){
    log = '確認テスト第１問（１）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          exam.push(1);
          exam2();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'確認テスト第１問（２）の自己採点結果を選択してください。'
  }).then(function(){
    log = '確認テスト第１問（２）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          exam.push(1);
          exam3();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'確認テスト第２問の自己採点結果を選択してください。'
  }).then(function(){
    log = '確認テスト第２問の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          exam.push(2);
          exam4();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    log = '確認テスト第３問の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          exam.push(2);
          exam5();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'確認テスト第４問の自己採点結果を選択してください。'
  }).then(function(){
    log = '確認テスト第４問の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          exam.push(2);
          exam6();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'確認テスト第５問の自己採点結果を選択してください。'
  }).then(function(){
    log = '確認テスト第５問の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          exam.push(2);
          reExamCheck();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
          exam.push(0);
          reExamCheck();
          break;
        default:quit();
      }
    });
  });
}

// function exam7(){
//   botui.message.add({
//     delay:100,
//     loading:true,
//     content:'確認テスト第４問（３）の自己採点結果を選択してください。'
//   }).then(function(){
//     log = '確認テスト第４問（３）の自己採点結果を選択してください。';
//     addBot(log);
//     return botui.action.button({
//       autoHide:false,
//       delay:10,
//       action:[
//         {icon:'circle-thin', text:'正解', value:'yes'},
//         {icon:'times', text:'不正解', value:'no'}
//       ]
//     }).then(function(res){
//       botui.action.hide();
//       switch(res.value){
//         case 'yes':
//           log = '正解';
//           addHuman(log);
//           exam.push(2);
//           reExamCheck();
//           break;
//         case 'no':
//           log = '不正解';
//           addHuman(log);
//           exam.push(0);
//           reExamCheck();
//           break;
//         default:quit();
//       }
//     });
//   });
// }

function reExamCheck(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テストは受験しましたか？'
  }).then(function(){
    log = '再テストは受験しましたか？';
    addBot(log);
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
          addHuman(reExamCheckIs);
          reExam1();
          break;
        case 'no':
          reExamCheckIs = '受験していない';
          addHuman(reExamCheckIs);
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
    content:'再テスト第１問（１）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第１問（１）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam2();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'再テスト第１問（２）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第１問（２）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam3();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'再テスト第２問（１）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第２問（１）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam4();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'再テスト第２問（２）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第２問（２）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam5();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'再テスト第３問（１）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第３問（１）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam6();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'再テスト第３問（２）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第３問（２）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam7();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    content:'再テスト３問（３）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第３問（３）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam8();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
          reExam.push(0);
          reExam8();
          break;
        default:quit();
      }
    });
  });
}

function reExam8(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト３問（４）の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第３問（４）の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(1);
          reExam9();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
          reExam.push(0);
          reExam9();
          break;
        default:quit();
      }
    });
  });
}

function reExam9(){
  botui.message.add({
    delay:100,
    loading:true,
    content:'再テスト第４問の自己採点結果を選択してください。'
  }).then(function(){
    log = '再テスト第４問の自己採点結果を選択してください。';
    addBot(log);
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
          log = '正解';
          addHuman(log);
          reExam.push(2);
          repoCheck();
          break;
        case 'no':
          log = '不正解';
          addHuman(log);
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
    log = '回答の確認をします。<br>';
    botui.message.add({
      delay:10,
      loading:true,
      content:'学習時間：' + repoTimeIs
    }).then(function(){
      log += '学習時間：' + repoTimeIs + '<br>';
      botui.message.add({
        delay:10,
        loading:true,
        content:'eラーニング回答状況：' + repoStudyIs
      }).then(function(){
        log += 'eラーニング回答状況：' + repoStudyIs + '<br>';
        correct = exam.reduce((a, x) => a+=x, 0);
        botui.message.add({
          delay:10,
          loading:true,
          content:'確認テスト合計点数：' + correct + '点'
        }).then(function(){
          log += '確認テスト合計点数：' + correct + '点<br>';
          if(reExamCheckIs == '受験した'){
            botui.message.add({
              delay:10,
              loading:true,
              content:'再テスト：' + reExamCheckIs
            }).then(function(){
              log += '再テスト：受験した<br>';
              correct2 = reExam.reduce((a, x) => a+=x, 0);
              botui.message.add({
                delay:10,
                loading:true,
                content:'再テスト合計点数：' + correct2 + '点'
              }).then(function(){
                log += '再テスト合計点数：' + correct2 + '点';
                addBot(log);
                repoEnd();
              });
            });
          }else{
            botui.message.add({
              delay:10,
              loading:true,
              content:'再テスト：' + reExamCheckIs
            }).then(function(){
              log += '再テスト：受験していない';
              addBot(log);
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
    log = '以上で登録しますか？';
    addBot(log);
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
            question();
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
            repoTime();
          });
          break;
      }
    });
  });
}

function question(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の確認テストの目標点数は何点だったか選択してください。'
  }).then(function(){
    log = '今回の確認テストの目標点数は何点だったか選択してください。';
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
      question1();
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
    content:'今回の学習理解度を選択してください。'
  }).then(function(){
    log = '今回の学習理解度を選択してください。';
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
        log = '今回の範囲に関しては完璧に理解している';
        addHuman(log);
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
    content:'今回学習した「命題論理・集合②」の中で、まだ理解ができていないと感じる箇所はありますか？（確認テストやeラーニングで不正解だった部分を理解しきれていない部分がありますか？）'
  }).then(function(){
    log = '今回学習した「命題論理・集合②」の中で、まだ理解ができていないと感じる箇所はありますか？（確認テストやeラーニングで不正解だった部分を理解しきれていない部分がありますか？）';
    addBot(log);
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
          log = 'ある';
          addHuman(log);
          question4();
          break;
        case 'no':
          log = 'ない';
          addHuman(log);
          question6();
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
    log = '感じている箇所はどんなところですか？できるだけ具体的に書いてみてください。';
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
  if((message.indexOf('必要条件') != -1) || (message.indexOf('十分条件') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'命題と条件　命題の真偽,必要条件・十分条件に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '命題と条件　命題の真偽,必要条件・十分条件に関する補足説明動画が見つかりました！<br>';
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
          content:'https://www.youtube.com/embed/E99EgJ5F2Zk'
        }).then(function(){
          log += 'https://www.youtube.com/embed/E99EgJ5F2Zk<br>';
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
                {icon:'circle-thin', text:'次へ', value:'next'}
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
  }else if((message.indexOf('逆') != -1) || (message.indexOf('裏') != -1)　|| (message.indexOf('対偶') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'命題と条件　逆・裏・対偶に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '命題と条件　逆・裏・対偶に関する補足説明動画が見つかりました！<br>';
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
          content:'https://www.youtube.com/embed/hKFF1_h-PtM'
        }).then(function(){
          log += 'https://www.youtube.com/embed/hKFF1_h-PtM<br>';
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
                {icon:'circle-thin', text:'次へ', value:'next'}
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
        {icon:'circle-thin', text:'はい', value:'yes'},
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
      content:'どのような説明があれば理解できそうですか？'
    }).then(function(){
      log += 'どのような説明があれば理解できそうですか？<br>';
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
            {icon:'superscript', text:'公式の説明', value:'1'},
            {icon:'question', text:'例題を用いて説明', value:'2'},
            {icon:'pencil', text:'その他（自由記述）', value:'3'}
          ]
        }).then(function(res){
          addHuman(res.value);
          botui.action.hide();
          if(res.value == '1'){
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
          }else if(res.value == '2'){
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
          }else if(res.value == '3'){
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
        {icon:'circle-thin', text:'ある', value:'yes'},
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
    log = '授業やシステムについて，意見はありますか？';
    addBot(log);
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
      content:'次回の振り返り時もお待ちしてます！'
    }).then(function(){
      log = '次回の振り返り時もお待ちしてます！';
      addBot(log);
      ishiDb(targetScore, actualScore, satisfaction);
      send_log(lesson, level, log_all);
      exam_check();
      send_exam();
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
