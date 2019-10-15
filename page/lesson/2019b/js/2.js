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
var level = 0;
var lesson = 2;

init();

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

// 質問１
function question1(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の予習は、順列①（和の法則，積の法則，順列の総数，順列の公式，円順列，重複順列）でした。'
  }).then(function(){
    log = '-----Q1-----\r\n今回の予習は、順列①（和の法則，積の法則，順列の総数，順列の公式，円順列，重複順列）でした。\r\n';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'全ての範囲を事前に学習してきましたか？'
    }).then(function(){
      log = '全ての範囲を事前に学習してきましたか？\r\n';
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
          log = '-----A1-----\r\nはい\r\n';
          add_log_human(log);
          question2();
          break;
        case 'no':
          log = '-----A1-----\r\nいいえ\r\n';
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
    content:'今回の範囲の中で、まだ理解ができていないと感じる箇所はありますか？'
  }).then(function(){
    log = '-----Q2-----\r\n今回の範囲の中で、まだ理解ができていないと感じる箇所はありますか？\r\n';
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
        log = '-----A2-----\r\nはい\r\n';
        add_log_human(log);
        question3();
        break;
      case 'no':
        log = 'いいえ\r\n';
        add_log_human(log);
        question5();
        break;
      case 'undo':
        log = '戻る\r\n';
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
    content:'理解が足りていないと自分が感じている箇所はどんな所でしたか？'
  }).then(function(){
    log = '-----Q3-----\r\n理解が足りていないと自分が感じている箇所はどんな所でしたか？';
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
        log = '-----A3-----\r\n' + res.value + '\r\n';
        add_log_human(log);
        message = res.value;
        botui.message.add({
          delay:1000,
          loading:true,
          content:'入力部分の理解度はどの程度ですか？'
        }).then(function(){
          log = '-----Q4-----\r\n入力部分の理解度はどの程度ですか？';
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
                log = '-----A4-----\r\n１：全く分からない、今すぐに教えてほしい\r\n';
                level = 1;
                add_log_human(log);
                search(message);
                break;
              case 'two':
                log = '-----A4-----\r\n２：少し分からない、教えてほしい\r\n';
                level = 2;
                add_log_human(log);
                search(message);
                break;
              case 'three':
                log = '-----A4-----\r\n３：多少は分かるが、理解しきれていない\r\n';
                level = 3;
                add_log_human(log);
                search(message);
                break;
              case 'four':
                log = '-----A4-----\r\n４：割と分かる\r\n';
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
  if(message.indexOf('場合の数') != -1){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'場合の数に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '----------\r\n場合の数に関する補足説明動画が見つかりました！\r\n';
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
          content:'https://www.youtube.com/embed/264GkHFM27Y'
        }).then(function(){
          log = 'https://www.youtube.com/embed/264GkHFM27Y\r\n';
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
                  log = '----------\r\n次へ\r\n';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '----------\r\n後で見る\r\n';
                  add_log_human(log);
                  question4();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('順列') != -1) && (message.indexOf('基本') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'順列の基本(場合の数)に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '----------\r\n順列の基本(場合の数)に関する補足説明動画が見つかりました！\r\n';
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
          content:'https://www.youtube.com/embed/lcQ0CeQsnl8'
        }).then(function(){
          log = 'https://www.youtube.com/embed/lcQ0CeQsnl8\r\n';
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
                  log = '----------\r\n次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '----------\r\n後で見る';
                  add_log_human(log);
                  question4();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('npr') != -1) || (message.indexOf('総数') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'nPr(順列の総数)に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '----------\r\nnPr(順列の総数)に関する補足説明動画が見つかりました！\r\n';
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
          content:'https://www.youtube.com/embed/N24cC9UmKBA'
        }).then(function(){
          log = 'https://www.youtube.com/embed/N24cC9UmKBA\r\n';
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
                  log = '----------\r\n次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '----------\r\n後で見る';
                  add_log_human(log);
                  question4();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('順列') != -1) && (message.indexOf('階乗') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'nPr(順列の総数・階乗)に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '----------\r\nnPr(順列の総数・階乗)に関する補足説明動画が見つかりました！\r\n';
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
          content:'https://www.youtube.com/embed/qKp-TpB0x6s'
        }).then(function(){
          log = 'https://www.youtube.com/embed/qKp-TpB0x6s\r\n';
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
                  log = '----------\r\n次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '----------\r\n後で見る';
                  add_log_human(log);
                  question4();
                  break;
              }
            });
          });
        });
      });
    });
  }else if((message.indexOf('円順列') != -1) || (message.indexOf('数珠') != -1)){
    botui.message.add({
      delay:1000,
      loading:true,
      content:'いろいろな順列(円順列・数珠順列)に関する補足説明動画が見つかりました！'
    }).then(function(){
      log = '----------\r\nいろいろな順列(円順列・数珠順列)に関する補足説明動画が見つかりました！\r\n';
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
          content:'https://www.youtube.com/embed/bV7jkjjyzqs'
        }).then(function(){
          log = 'https://www.youtube.com/embed/bV7jkjjyzqs\r\n';
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
                  log = '----------\r\n次へ';
                  add_log_human(log);
                  movie_question();
                  break;
                case 'ato':
                  log = '----------\r\n後で見る';
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
    log = '-----Q5-----\r\n送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？\r\n';
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
        log = '-----A5-----\r\nはい\r\n';
        add_log_human(log);
        mvgood();
        break;
      case 'no':
        log = '-----A5-----\r\nいいえ\r\n';
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
    log = '-----Q6-----\r\nありがとうございます！\r\n';
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
            log = '-----A6-----\r\n' + res.value + '\r\n';
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
    log = '-----Q6-----\r\nごめんなさい・・・\r\n';
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
            log = '-----A6-----\r\n' + res.value + '\r\n';
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
    log = '-----Q5-----\r\nうーん・・・\r\n';
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
            log = '-----A5-----\r\n公式の説明\r\n';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '-----Q6-----\r\n特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！\r\n';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = '-----A6-----\r\n' + res.value + '\r\n';
                add_log_human(log);
                question4();
              });
            });
          }else if(res.value == '2'){
            log = '例題を用いて\r\n';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '-----Q6-----\r\n特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！\r\n';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = '-----A6-----\r\n' + res.value + '\r\n';
                add_log_human(log);
                question4();
              });
            });
          }else if(res.value == '3'){
            log = 'その他（自由記述）\r\n';
            add_log_human(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: 'どのような説明方法を希望しますか？具体的に書いてみてください。'
            }).then(function(){
              log = '-----Q6-----\r\nどのような説明方法を希望しますか？具体的に書いてみてください。\r\n';
              add_log_bot(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(res){
                log = '-----A6-----\r\n' + res.value + '\r\n';
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
    log = '-----Q7-----\r\n他に分からないと感じている箇所はありますか？\r\n';
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
          log = '-----A7-----\r\n' + res.value + '\r\n';
          add_log_human(log);
          question3();
          break;
        case 'no':
          log = '-----A7-----\r\n' + res.value + '\r\n';
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
    log = '-----Q8-----\r\n授業やシステムについて，意見はありますか？\r\n';
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
        log = '-----A8-----\r\nある\r\n';
        add_log_human(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'自由に記述してください．'
        }).then(function(){
          log = '-----Q9-----\r\n自由に記述してください\r\n';
          add_log_bot(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'自由記述'
            }
          }).then(function(res){
            log = '-----A9-----\r\n' + res.value + '\r\n';
            add_log_human(log);
            end();
          });
        });
      }else{
        log = '-----A8-----\r\nない\r\n';
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
    log = '-----end-----\r\n振り返りお疲れ様でした！';
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
    log = '-----exception-----\r\n何らかのエラーが発生しました．やり直してください．';
    add_log_bot(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'[ここを押して前のページに戻る](https://takagi-lab.tk/chatbot/page/lesson/2019b/)'
    });
  });
}

})();
