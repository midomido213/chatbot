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

init();

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

// 入力から動画の検索（問い返しなど）
// function search(message){
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', search_api + message);
//   xhr.onload = function(){
//     var result = JSON.parse(xhr.responseText);
//
//     search_result(result.~~~);
//
//   }
// }

function init(){
  botui.message.add({
    content:'こんにちは！'
  }).then(function(){
    log = 'こんにちは！';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'予習の振り返りをしよう！'
    }).then(function(){
      log = '予習の振り返りをしよう！';
      add_log_bot(log);
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
            add_log_human(log);
            yuki();
            break;
          case 'no':
            log = 'いいえ';
            add_log_human(log);
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
      content:'予習の振り返りをしよう！'
    }).then(function(){
      log = '予習の振り返りをしよう！';
      add_log_bot(log);
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
            add_log_human(log);
            yuki();
            break;
          case 'no':
            log = 'いいえ';
            add_log_human(log);
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
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'振り返りしますか？(*^^)'
      }).then(function(){
        log = '振り返りしますか？(*^^)';
        add_log_bot(log);
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
              add_log_human(log);
              yuki();
              break;
            case 'no':
              log = 'いいえ';
              add_log_human(log);
              angry();
              break;
            default:quit();
          }
        });
      });
    });
  }
}

// ゆうきくんの振り返り
function yuki(){
  log = '今回の事前テストの目標点数は何点でしたか？';
  add_log_bot(log);
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の事前テストの目標点数は何点でしたか？',
  }).then(function(){
    botui.action.select({
      action:{
        placeholder:'点数を選んでね',
        value:'0',
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
      log = res.value;
      add_log_human(log);
      targetScore = res.value;
      yuki2();
    });
  });
}

function yuki2(){
  log = '事前テストの点数は何点でしたか？';
  add_log_bot(log);
  botui.message.add({
    delay:1000,
    loading:true,
    content:'事前テストの点数は何点でしたか？',
  }).then(function(){
    botui.action.select({
      action:{
        placeholder:'点数を選んでね',
        value:'0',
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
      log = res.value;
      add_log_human(log);
      actualScore = res.value;
      yuki3();
    });
  });
}


function yuki3(){
  log = '目標得点と実際の得点の結果から気づいたことを記入してください。';
  add_log_bot(log);

  botui.message.add({
    delay:1000,
    loading:true,
    content:'目標得点と実際の得点の結果から気づいたことを記入してください。'
  }).then(function(){
    return botui.action.text({
      delay:1000,
      action:{
        placeholder: ''
      }
    });
  }).then(function(res){
    log = res.value;
    add_log_human(log);
    freeDescription = res.value;
    yukiDb(targetScore, actualScore, freeDescription);
    question1();
  });
}

// 質問１
function question1(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の予習は、統計②（散らばりと相関係数）でした。'
  }).then(function(){
    log = '今回の予習は、統計②（散らばりと相関係数）でした。';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'すべての範囲を事前に学習してきましたか？'
    }).then(function(){
      log = 'すべての範囲を事前に学習してきましたか？';
      add_log_bot(log);
      // ボタン表示
      return botui.action.button({
        autoHide:false,
        delay:1000,
        action:[
          {icon:'circle-thin', text:'はい', value:'はい'},
          {icon:'times', text:'いいえ', value:'いいえ'}
        ]
      });
    }).then(function(res){
      botui.action.hide();
      log = res.value;
      add_log_human(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'今回の学習満足度を選択してください。'
      }).then(function(){
        log = '今回の学習満足度を選択してください。';
        add_log_bot(log);
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
    });
  });
}

// 質問２
function question2(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'これまでの確率の範囲の中で、まだ理解ができていないと感じる箇所はありますか？'
  }).then(function(){
    log = 'これまでの確率の範囲の中で、まだ理解ができていないと感じる箇所はありますか？';
    add_log_bot(log);
    // ボタン表示
    return botui.action.button({
      autoHIde:false,
      delay:1000,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'},
        {icon:'undo', text:'戻る', value:'undo'}
      ]
    });
  }).then(function(res){
    botui.action.hide();
    switch(res.value){
      case 'yes':
        log = 'はい';
        add_log_human(log);
        question3();
        break;
      case 'no':
        log = 'いいえ';
        add_log_human(log);
        question5();
        break;
      case 'undo':
        log = '戻る';
        add_log_human(log);
        question1();
        break;
      default:quit();
    }
  });
}

// 質問３
function question3(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の事前学習や事前テストを通して理解が足りていないと自分が感じている箇所はどんな所ですか？'
  }).then(function(){
    log = '今回の事前学習や事前テストを通して理解が足りていないと自分が感じている箇所はどんな所ですか？';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'できるだけ具体的に書いてみてください．'
    }).then(function(){
      log = 'できるだけ具体的に書いてみてください．';
      add_log_bot(log);
      return botui.action.text({
        delay:1000,
        loading:true,
        action:{placeholder:'例: 演習プリント◯問目の，数学的帰納法中のn=k+1の計算方法がよく分からない．'}
      }).then(function(res){
        log = res.value;
        add_log_human(log);
        message = res.value;
        botui.message.add({
          delay:1000,
          loading:true,
          content:'入力部分の理解度はどの程度ですか？'
        }).then(function(){
          log = '入力部分の理解度はどの程度ですか？';
          add_log_bot(log);
          return botui.action.button({
            autoHide:false,
            delay:1000,
            action:[
              {icon:'skull-crossbones', text:'１：全く分からない、今すぐに教えてほしい', value:'one'},
              {icon:'exclamation-triangle', text:'２：少し分からない、教えてほしい', value:'two'},
              {icon:'triangle', text:'３：多少は分かるが、理解しきれていない', value:'three'},
              {icon:'circle-thin', text:'４：割と分かる', value:'four'},
              {icon:'undo', text:'入力し直す', value:'undo'}
            ]
          }).then(function(res){
            botui.action.hide();
            switch(res.value){
              case 'one':
                log = '１：全く分からない、今すぐに教えてほしい';
                level = 1;
                add_log_human(log);
                search(message);
                break;
              case 'two':
                log = '２：少し分からない、教えてほしい';
                level = 2;
                add_log_human(log);
                search(message);
                break;
              case 'three':
                log = '３：多少は分かるが、理解しきれていない';
                level = 3;
                add_log_human(log);
                search(message);
                break;
              case 'four':
                log = '４：割と分かる';
                level = 4;
                add_log_human(log);
                search(message);
                break;
              case 'undo':
                log = '入力し直す';
                add_log_human(log);
                question3();
                break;
              default:quit();
            }
          });
        });
      });
    });
  });
}

// search(暫定)
function search(message){
  // botui.message.add({
  //   content:message
  // });
  if((message.indexOf('資料') != -1) || (message.indexOf('整理') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'資料の整理に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '資料の整理に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/EhAdIVd_h-c'
        }).then(function(){
          log = 'https://www.youtube.com/embed/EhAdIVd_h-c';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log = '動画を見終わったらボタンを押してください．';
            add_log_bot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'circle-thin', text:'次へ', value:'next'},
                {icon:'', text:'後で見る', value:'ato'}
              ]
            }).then(function(res){
              botui.action.hide();
              switch(res.value){
                case 'next':
                  log = '次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '後で見る';
                  add_log_human(log);
                  question4();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('平均値') != -1) || (message.indexOf('最頻値') != -1) || (message.indexOf('中央値') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'平均値・最頻値・中央値に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '平均値・最頻値・中央値に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/IVQEyzuU3nQ'
        }).then(function(){
          log = 'https://www.youtube.com/embed/IVQEyzuU3nQ';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log = '動画を見終わったらボタンを押してください．';
            add_log_bot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'circle-thin', text:'次へ', value:'next'},
                {icon:'', text:'後で見る', value:'ato'}
              ]
            }).then(function(res){
              botui.action.hide();
              switch(res.value){
                case 'next':
                  log = '次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '後で見る';
                  add_log_human(log);
                  question4();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('重複') != -1) || (message.indexOf('確率') != -1) || (message.indexOf('問3') != -1) || (message.indexOf('問4') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'第8回問3,4重複組合せ・確率に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '第8回問3,4重複組合せ・確率に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/0cRGJOMT_n0'
        }).then(function(){
          log = 'https://www.youtube.com/embed/0cRGJOMT_n0';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log = '動画を見終わったらボタンを押してください．';
            add_log_bot(log);
            return botui.action.button({
              autoHide:false,
              delay:1000,
              action:[
                {icon:'circle-thin', text:'次へ', value:'next'},
                {icon:'', text:'後で見る', value:'ato'}
              ]
            }).then(function(res){
              botui.action.hide();
              switch(res.value){
                case 'next':
                  log = '次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '後で見る';
                  add_log_human(log);
                  question4();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('確率') != -1) || (message.indexOf('問6') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'第8回問6確率に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '第8回問6確率に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/-lS3RkPnuXY'
        }).then(function(){
          log = 'https://www.youtube.com/embed/-lS3RkPnuXY';
          add_log_bot(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見終わったらボタンを押してください．'
            }).then(function(){
              log = '動画を見終わったらボタンを押してください．';
              add_log_bot(log);
              return botui.action.button({
                autoHide:false,
                delay:1000,
                action:[
                  {icon:'circle-thin', text:'次へ', value:'next'},
                  {icon:'', text:'後で見る', value:'ato'}
                ]
              }).then(function(res){
                botui.action.hide();
                switch(res.value){
                  case 'next':
                    log = '次へ';
                    add_log_human(log);
                    movie_question();
                    break;
                  case 'ato':
                    log = '後で見る';
                    add_log_human(log);
                    question4();
                    break;
                }
            });
          });
        });
      });
    });
  }else if(message.indexOf('期待値') != -1){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'期待値に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '期待値に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/gdz0lQNhVUE'
        }).then(function(){
          log = 'https://www.youtube.com/embed/gdz0lQNhVUE';
          add_log_bot(log);
            botui.message.add({
              delay:1000,
              loading:true,
              type:'embed',
              content:'https://www.youtube.com/embed/BzL6pc_LhaE'
            }).then(function(){
              log = 'https://www.youtube.com/embed/BzL6pc_LhaE';
              add_log_bot(log);
              botui.message.add({
                delay:1000,
                loading:true,
                content:'動画を見終わったらボタンを押してください．'
              }).then(function(){
                log = '動画を見終わったらボタンを押してください．';
                add_log_bot(log);
                return botui.action.button({
                  autoHide:false,
                  delay:1000,
                  action:[
                    {icon:'circle-thin', text:'次へ', value:'next'},
                    {icon:'', text:'後で見る', value:'ato'}
                  ]
                }).then(function(res){
                  botui.action.hide();
                  switch(res.value){
                    case 'next':
                      log = '次へ';
                      add_log_human(log);
                      movie_question();
                      break;
                    case 'ato':
                      log = '後で見る';
                      add_log_human(log);
                      question4();
                      break;
                  }
              });
            });
          });
        });
      });
    });
  }else if((message.indexOf('期待値') != -1) && (message.indexOf('応用') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'応用期待値に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '応用期待値に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/P4xgGNCg8VM'
        }).then(function(){
          log = 'https://www.youtube.com/embed/P4xgGNCg8VM';
          add_log_bot(log);
            botui.message.add({
              delay:1000,
              loading:true,
              type:'embed',
              content:'https://www.youtube.com/embed/zc0Cl9ZkoaQ'
            }).then(function(){
              log = 'https://www.youtube.com/embed/zc0Cl9ZkoaQ';
              add_log_bot(log);
              botui.message.add({
                delay:1000,
                loading:true,
                content:'動画を見終わったらボタンを押してください．'
              }).then(function(){
                log = '動画を見終わったらボタンを押してください．';
                add_log_bot(log);
                return botui.action.button({
                  autoHide:false,
                  delay:1000,
                  action:[
                    {icon:'circle-thin', text:'次へ', value:'next'},
                    {icon:'', text:'後で見る', value:'ato'}
                  ]
                }).then(function(res){
                  botui.action.hide();
                  switch(res.value){
                    case 'next':
                      log = '次へ';
                      add_log_human(log);
                      movie_question();
                      break;
                    case 'ato':
                      log = '後で見る';
                      add_log_human(log);
                      question4();
                      break;
                  }
              });
            });
          });
        });
      });
    });
  }else if(message.indexOf('二項分布') != -1){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'二項分布に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '二項分布に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/DEJ1Oi_ZMvY'
        }).then(function(){
          log = 'https://www.youtube.com/embed/DEJ1Oi_ZMvY';
          add_log_bot(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見終わったらボタンを押してください．'
            }).then(function(){
              log = '動画を見終わったらボタンを押してください．';
              add_log_bot(log);
              return botui.action.button({
                autoHide:false,
                delay:1000,
                action:[
                  {icon:'circle-thin', text:'次へ', value:'next'},
                  {icon:'', text:'後で見る', value:'ato'}
                ]
              }).then(function(res){
                botui.action.hide();
                switch(res.value){
                  case 'next':
                    log = '次へ';
                    add_log_human(log);
                    movie_question();
                    break;
                  case 'ato':
                    log = '後で見る';
                    add_log_human(log);
                    question4();
                    break;
                }
            });
          });
        });
      });
    });
  }else if((message.indexOf('平均') != -1) || (message.indexOf('分散') != -1) || (message.indexOf('標準偏差') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'平均・分散・標準偏差に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '平均・分散・標準偏差に関する補足説明動画が見つかりました！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/G5Aptuz2f1E'
        }).then(function(){
          log = 'https://www.youtube.com/embed/G5Aptuz2f1E';
          add_log_bot(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見終わったらボタンを押してください．'
            }).then(function(){
              log = '動画を見終わったらボタンを押してください．';
              add_log_bot(log);
              return botui.action.button({
                autoHide:false,
                delay:1000,
                action:[
                  {icon:'circle-thin', text:'次へ', value:'next'},
                  {icon:'', text:'後で見る', value:'ato'}
                ]
              }).then(function(res){
                botui.action.hide();
                switch(res.value){
                  case 'next':
                    log = '次へ';
                    add_log_human(log);
                    movie_question();
                    break;
                  case 'ato':
                    log = '後で見る';
                    add_log_human(log);
                    question4();
                    break;
                }
            });
          });
        });
      });
    });
  }else if((message.indexOf('特になし') != -1) || (message.indexOf('ない') != -1) || (message.indexOf('なし') != -1)){
    question5();
  }else{
    no_movie();
  }
}

// 動画あり
function movie_question(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？'
  }).then(function(){
    log = '送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？';
    add_log_bot(log);
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
        add_log_human(log);
        mvgood();
        break;
      case 'no':
        log = 'いいえ';
        add_log_human(log);
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
    log = 'ありがとうございます！';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'特に役に立った部分を教えてください！'
    }).then(function(){
      log = '特に役に立った部分を教えてください！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，役に立った内容の動画時間など何でも構いません！'
      }).then(function(){
        log = '説明方法や，役に立った内容の動画時間など何でも構いません！';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'改善してほしい点もあれば加えて記入してください！'
        }).then(function(){
          log = '改善してほしい点もあれば加えて記入してください！';
          add_log_bot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりやすかった．'
            }
          }).then(function(res){
            log = res.value;
            add_log_human(log);
            question4();
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
    log = 'ごめんなさい・・・';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'良ければ改善点を教えてください！'
    }).then(function(){
      log = '良ければ改善点を教えてください！';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，分かりにくかった内容の動画時間など何でも構いません．'
      }).then(function(){
        log = '説明方法や，分かりにくかった内容の動画時間など何でも構いません．';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'よろしくお願いします！'
        }).then(function(){
          log = 'よろしくお願いします！';
          add_log_bot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりにくい．〇〇のような説明を求めます．'
            }
          }).then(function(res){
            log = res.value;
            add_log_human(log);
            question4();
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
    content:'動画を検索しましたが，この部分を解説した動画はまだないようです．'
  }).then(function(){
    log = '動画を検索しましたが，この部分を解説した動画はまだないようです．';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'どのような説明をしてもらいたいですか？'
    }).then(function(){
      log = 'どのような説明をしてもらいたいですか？';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'下記から選択してください．'
      }).then(function(){
        log = '下記から選択してください．';
        add_log_bot(log);
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
            log = '公式の説明';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = res.value;
                add_log_human(log);
                question4();
              });
            });
          }else if(res.value == '2'){
            log = '例題を用いて';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = res.value;
                add_log_human(log);
                question4();
              });
            });
          }else if(res.value == '3'){
            log = 'その他（自由記述）';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: 'どのような説明方法を希望しますか？具体的に書いてみてください。'
            }).then(function(){
              log = 'どのような説明方法を希望しますか？具体的に書いてみてください。';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = res.value;
                add_log_human(log);
                question4();
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

// 質問４
function question4(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'他に分からないと感じている箇所はありますか？'
  }).then(function(){
    log = '他に分からないと感じている箇所はありますか？';
    add_log_bot(log);
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
          log = res.value;
          add_log_human(log);
          question3();
          break;
        case 'no':
          log = res.value;
          add_log_human(log);
          question5();
          break;
        default:quit();
      }
    });
  });
}

// 質問５
function question5(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'授業やシステムについて，意見はありますか？'
  }).then(function(){
    log = '授業やシステムについて，意見はありますか？';
    add_log_bot(log);
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
        add_log_human(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'自由に記述してください．'
        }).then(function(){
          log = '自由に記述してください';
          add_log_bot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'自由記述'
            }
          }).then(function(res){
            log = res.value;
            add_log_human(log);
            end();
          });
        });
      }else{
        log = 'ない';
        add_log_human(log);
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
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'次回もよろしくお願いします！'
    }).then(function(){
        log = '次回もよろしくお願いします';
        add_log_bot(log);
        send_log_final(lesson, level, log_all, log_bot, log_human);
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
    log = '何らかのエラーが発生しました．やり直してください．';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'[ここを押して前のページに戻る](https://takagi-lab.tk/g031o008/plan/view/main/)'
    });
  });
}
})();
