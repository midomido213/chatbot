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
var level = 0;
var lesson = 7;

init();

// yukiのDB関数
function yukiDb(targetScore, actualScore, freeDescription){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', yuki_db_url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.send('lesson=' + lesson + '&targetScore=' + targetScore + '&actualScore=' + actualScore + '&freeDescription=' + freeDescription);
}

// ishiのDB関数
function ishiDb(targetScore, actualScore){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', ishi, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.send('targetScore=' + targetScore + '&actualScore=' + actualScore);
}

// ログ書き足し関数１
function add_log_bot(log){
  log_all += log;
  log_bot += log;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url + log);
  xhr.onload = function(){}
  xhr.send();
}

// ログ書き足し関数２
function add_log_human(log){
  log_all += log;
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
  log = '---START---\r\n';
  add_log_bot(log);
  botui.message.add({
    content:'こんにちは！'
  }).then(function(){
    log = 'こんにちは！\r\n';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'予習の振り返りをしよう！'
    }).then(function(){
      log = '予習の振り返りをしよう！\r\n';
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
            log = 'はい\r\n';
            add_log_human(log);
            question1();
            break;
          case 'no':
            log = 'いいえ\r\n';
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
      log = '予習の振り返りをしよう！\r\n';
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
            log = 'はい\r\n';
            add_log_human(log);
            question1();
            break;
          case 'no':
            log = 'いいえ\r\n';
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
      log = '早く"はい"を押して振り返りしてください（#^ω^）\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'振り返りしますか？(*^^)'
      }).then(function(){
        log = '振り返りしますか？(*^^)\r\n';
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
              log = 'はい\r\n';
              add_log_human(log);
              question1();
              break;
            case 'no':
              log = 'いいえ\r\n';
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
  log = '\r\n今回の事前テストの目標点数は何点でしたか？\r\n';
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
      log = '\r\n' + res.value + '\r\n';
      add_log_human(log);
      targetScore = res.value;
      yuki2();
    });
  });
}

function yuki2(){
  log = '\r\n事前テストの点数は何点でしたか？\r\n';
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
      log = '\r\n' + res.value + '\r\n';
      add_log_human(log);
      actualScore = res.value;
      yuki3();
    });
  });
}


function yuki3(){
  log = '\r\n目標得点と実際の得点の結果から気づいたことを記入してください。\r\n';
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
    log = '\r\n' + res.value + '\r\n';
    add_log_human(log);
    freeDescription = res.value;
    yukiDb(targetScore, actualScore, freeDescription);
    ishiDb(targetScore, actualScore);
    question1();
  });
}

// 質問１
function question1(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の予習は、作問学習でした。'
  }).then(function(){
    log = '\r\n-----Q-----\r\n今回の予習は、作問学習でした。\r\n';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'問題を事前に作成してきましたか？'
    }).then(function(){
      log = '問題を事前に作成してきましたか？\r\n';
      add_log_bot(log);
      // ボタン表示
      return botui.action.button({
        autoHide:false,
        delay:1000,
        action:[
          {icon:'circle-thin', text:'はい', value:'yes'},
          {icon:'times', text:'いいえ', value:'no'}
        ]
      });
    }).then(function(res){
      botui.action.hide();
      switch(res.value){
        case 'yes':
          log = '\r\n-----A-----\r\nはい\r\n';
          add_log_human(log);
          question2();
          break;
        case 'no':
          log = '\r\n-----A-----\r\nいいえ\r\n';
          add_log_human(log);
          question2();
          break;
        default:quit();
      }
    });
  });
}

// 質問２
function question2(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'第5回、第6回で学んできた組合せの範囲の中で、まだ理解ができていないと感じる箇所はありますか？'
  }).then(function(){
    log = '\r\n-----Q-----\r\n第5回、第6回で学んできた組合せの範囲の中で、まだ理解ができていないと感じる箇所はありますか？\r\n';
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
        log = '\r\n-----A-----\r\nはい\r\n';
        add_log_human(log);
        question3();
        break;
      case 'no':
        log = '\r\n-----A-----\r\nいいえ\r\n';
        add_log_human(log);
        question5();
        break;
      case 'undo':
        log = '\r\n-----A-----\r\n戻る\r\n';
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
    content:'理解が足りていないと自分が感じている箇所はどんな所ですか？'
  }).then(function(){
    log = '\r\n-----Q-----\r\n理解が足りていないと自分が感じている箇所はどんな所ですか？';
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
        log = '\r\n-----A-----\r\n' + res.value + '\r\n';
        add_log_human(log);
        message = res.value;
        botui.message.add({
          delay:1000,
          loading:true,
          content:'入力部分の理解度はどの程度ですか？'
        }).then(function(){
          log = '\r\n-----Q-----\r\n入力部分の理解度はどの程度ですか？';
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
                log = '\r\n-----A-----\r\n１：全く分からない、今すぐに教えてほしい\r\n';
                level = 1;
                add_log_human(log);
                search(message);
                break;
              case 'two':
                log = '\r\n-----A-----\r\n２：少し分からない、教えてほしい\r\n';
                level = 2;
                add_log_human(log);
                search(message);
                break;
              case 'three':
                log = '\r\n-----A-----\r\n３：多少は分かるが、理解しきれていない\r\n';
                level = 3;
                add_log_human(log);
                search(message);
                break;
              case 'four':
                log = '\r\n-----A-----\r\n４：割と分かる\r\n';
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
  if((message.indexOf('順列') != -1) && (message.indexOf('同じもの') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'同じものを含む順列に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '\r\n----------\r\n同じものを含む順列に関する補足説明動画が見つかりました！\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！\r\n';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/HN_eJBSFsjs'
        }).then(function(){
          log = 'https://www.youtube.com/embed/HN_eJBSFsjs\r\n';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log = '動画を見終わったらボタンを押してください．\r\n';
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
                  log = '\r\n----------\r\n次へ\r\n';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '\r\n----------\r\n後で見る\r\n';
                  add_log_human(log);
                  question4();
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
      log = '\r\n----------\r\n組合せ(nCr)に関する補足説明動画が見つかりました！\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！\r\n';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/3Wnl0KWfG5c'
        }).then(function(){
          log = 'https://www.youtube.com/embed/3Wnl0KWfG5c\r\n';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log = '動画を見終わったらボタンを押してください．\r\n';
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
                  log = '\r\n----------\r\n次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '\r\n----------\r\n後で見る';
                  add_log_human(log);
                  question4();
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
      log = '\r\n----------\r\n重複組合せに関する補足説明動画が見つかりました！\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！\r\n';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/3yECPH9vv1k'
        }).then(function(){
          log = 'https://www.youtube.com/embed/3yECPH9vv1k\r\n';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log = '動画を見終わったらボタンを押してください．\r\n';
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
                  log = '\r\n----------\r\n次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '\r\n----------\r\n後で見る';
                  add_log_human(log);
                  question4();
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
      log = '\r\n----------\r\n二項定理に関する補足説明動画が見つかりました！\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！\r\n';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/G6HBZuRr-p8'
        }).then(function(){
          log = 'https://www.youtube.com/embed/G6HBZuRr-p8\r\n';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            type:'embed',
            content:'https://www.youtube.com/embed/8IO_MZ7kYBo'
          }).then(function(){
            log = 'https://www.youtube.com/embed/8IO_MZ7kYBo\r\n';
            add_log_bot(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見終わったらボタンを押してください．'
            }).then(function(){
              log = '動画を見終わったらボタンを押してください．\r\n';
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
                    log = '\r\n----------\r\n次へ';
                    add_log_human(log);
                    movie_question();
                    break;
                  case 'ato':
                    log = '\r\n----------\r\n後で見る';
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
  }else if(message.indexOf('多項定理') != -1){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'多項定理に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '\r\n----------\r\n多項定理に関する補足説明動画が見つかりました！\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'動画を見ることで理解できるかもしれないので，見てみてください！'
      }).then(function(){
        log = '動画を見ることで理解できるかもしれないので，見てみてください！\r\n';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          type:'embed',
          content:'https://www.youtube.com/embed/uHvkaVk5yJk'
        }).then(function(){
          log = 'https://www.youtube.com/embed/uHvkaVk5yJk\r\n';
          add_log_bot(log);
          botui.message.add({
            delay:1000,
            loading:true,
            content:'動画を見終わったらボタンを押してください．'
          }).then(function(){
            log = '動画を見終わったらボタンを押してください．\r\n';
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
                  log = '\r\n----------\r\n次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '\r\n----------\r\n後で見る';
                  add_log_human(log);
                  question4();
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

// 動画あり
function movie_question(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？'
  }).then(function(){
    log = '\r\n-----Q-----\r\n送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？\r\n';
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
        log = '\r\n-----A-----\r\nはい\r\n';
        add_log_human(log);
        mvgood();
        break;
      case 'no':
        log = '\r\n-----A-----\r\nいいえ\r\n';
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
    log = '\r\n-----Q-----\r\nありがとうございます！\r\n';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'特に役に立った部分を教えてください！'
    }).then(function(){
      log = '特に役に立った部分を教えてください！\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，役に立った内容の動画時間など何でも構いません！'
      }).then(function(){
        log = '説明方法や，役に立った内容の動画時間など何でも構いません！\r\n';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'改善してほしい点もあれば加えて記入してください！'
        }).then(function(){
          log = '改善してほしい点もあれば加えて記入してください！\r\n';
          add_log_bot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりやすかった．'
            }
          }).then(function(res){
            log = '\r\n-----A-----\r\n' + res.value + '\r\n';
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
    log = '\r\n-----Q-----\r\nごめんなさい・・・\r\n';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'良ければ改善点を教えてください！'
    }).then(function(){
      log = '良ければ改善点を教えてください！\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，分かりにくかった内容の動画時間など何でも構いません．'
      }).then(function(){
        log = '説明方法や，分かりにくかった内容の動画時間など何でも構いません．\r\n';
        add_log_bot(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'よろしくお願いします！'
        }).then(function(){
          log = 'よろしくお願いします！\r\n';
          add_log_bot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりにくい．〇〇のような説明を求めます．'
            }
          }).then(function(res){
            log = '\r\n-----A-----\r\n' + res.value + '\r\n';
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
    content:'うーん・・・'
  }).then(function(){
    log = '\r\n-----Q-----\r\nうーん・・・\r\n';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'この部分を解説した補足説明動画はまだないようです．'
    }).then(function(){
      log = 'この部分を解説した補足説明動画はまだないようです．\r\n';
      add_log_bot(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'どのような解説動画があれば理解できると思いますか？'
      }).then(function(){
        log = 'どのような解説動画があれば理解できると思いますか？\r\n';
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
            log = '\r\n-----A-----\r\n公式の説明\r\n';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '\r\n-----Q-----\r\n特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！\r\n';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = '\r\n-----A-----\r\n' + res.value + '\r\n';
                add_log_human(log);
                question4();
              });
            });
          }else if(res.value == '2'){
            log = '\r\n-----A-----\r\n例題を用いて\r\n';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '\r\n-----Q-----\r\n特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！\r\n';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = '\r\n-----A-----\r\n' + res.value + '\r\n';
                add_log_human(log);
                question4();
              });
            });
          }else if(res.value == '3'){
            log = '\r\n-----A-----\r\nその他（自由記述）\r\n';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: 'どのような説明方法を希望しますか？具体的に書いてみてください。'
            }).then(function(){
              log = '\r\n-----Q-----\r\nどのような説明方法を希望しますか？具体的に書いてみてください。\r\n';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = '\r\n-----A-----\r\n' + res.value + '\r\n';
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
    log = '\r\n-----Q-----\r\n他に分からないと感じている箇所はありますか？\r\n';
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
          log = '-----A-----\r\n' + res.value + '\r\n';
          add_log_human(log);
          question3();
          break;
        case 'no':
          log = '-----A-----\r\n' + res.value + '\r\n';
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
    log = '\r\n-----Q-----\r\n授業やシステムについて，意見はありますか？\r\n';
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
        log = '\r\n-----A-----\r\nある\r\n';
        add_log_human(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'自由に記述してください．'
        }).then(function(){
          log = '\r\n-----Q-----\r\n自由に記述してください\r\n';
          add_log_bot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'自由記述'
            }
          }).then(function(res){
            log = '\r\n-----A-----\r\n' + res.value + '\r\n';
            add_log_human(log);
            end();
          });
        });
      }else{
        log = '\r\n-----A-----\r\nない\r\n';
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
    log = '\r\n-----end-----\r\n振り返りお疲れ様でした！';
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
          content:'[ココを押して振り返り終了](https://takagi-lab.tk/chatbot/page/lesson/2019b/)'
      });
    });
  });
}

// エラー
function quit(){
  botui.message.add({
    content:'何らかのエラーが発生しました．やり直してください．'
  }).then(function(){
    log = '\r\n-----exception-----\r\n何らかのエラーが発生しました．やり直してください．';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'[ここを押して前のページに戻る](https://takagi-lab.tk/chatbot/page/lesson/2019b/)'
    });
  });
}
})();
