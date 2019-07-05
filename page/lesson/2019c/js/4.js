(function(){

var botui = new BotUI('chat-app');

var message;
var log;
var url = '../api/send_log.php?log=';

// ログ保存関数
function sendlog(log){
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url + log);
  xhr.onload = function(){}
  xhr.send();
}

log = '---START---';
sendlog(log);

// 初期メッセージ
botui.message.add({
  content:'こんにちは！'
}).then(function(){
  log = 'こんにちは！';
  sendlog(log);
  botui.message.add({
    delay:1000,
    loading:true,
    content:'予習の振り返りをしよう！'
  }).then(function(){
    log = '予習の振り返りをしよう！';
    sendlog(log);
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
        log = res.value;
        sendlog(log);
        q1();
        break;
      case 'no':
        log = res.value;
        sendlog(log);
        quit();
        break;
      default:quit();
    }
  });
});

// Question1
function q1(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今回の予習は、作文演習でした。'
  }).then(function(){
    log = '今回の予習は、作文演習でした。';
    sendlog(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'問題を事前に作成してきましたか？'
    }).then(function(){
      log = '問題を事前に作成してきましたか？';
      sendlog(log);
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
          log = res.value;
          sendlog(log);
          q2();
          break;
        case 'no':
          log = res.value;
          sendlog(log);
          q2();
          break;
        default:q2();
      }
    });
  });
}

// Question2
function q2(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'今までの命題論理、集合、背理法、数学的帰納法の範囲で、まだ理解ができていないと感じる箇所はありますか？'
  }).then(function(){
    log = '今までの命題論理、集合、背理法、数学的帰納法の範囲で、まだ理解ができていないと感じる箇所はありますか？';
    sendlog(log);
    // ボタン表示
    return botui.action.button({
      autoHIde:false,
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
        log = res.value;
        sendlog(log);
        q3();
        break;
      case 'no':
        log = res.value;
        sendlog(log);
        q4();
        break;
      default:quit();
    }
  });
}

// Question3
function q3(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'理解が足りていないと自分が感じている箇所はどんな所でしたか？'
  }).then(function(){
    log = '理解が足りていないと自分が感じている箇所はどんな所でしたか？';
    sendlog(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'できるだけ具体的に書いてみてください．'
    }).then(function(){
      log = 'できるだけ具体的に書いてみてください．';
      sendlog(log);
      return botui.action.text({
        delay:1000,
        loading:true,
        action:{
          placeholder:'例: 演習プリント◯問目の，数学的帰納法中のn=k+1の計算方法がよく分からない．'
        }
      }).then(function(res){
        log = res.value;
        sendlog(log);

        message = res.value;

        if((message.indexOf('数学的帰納法') != -1) || (message.indexOf('帰納法') != -1)){
          botui.message.add({
            delay:1000,
            loading:true,
            content:'数学的帰納法に関する補足説明動画が見つかりました！'
          }).then(function(){
            log = '数学的帰納法に関する補足説明動画が見つかりました！';
            sendlog(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見ることで理解できるかもしれないので，見てみてください！'
            }).then(function(){
              log = '動画を見ることで理解できるかもしれないので，見てみてください！';
              sendlog(log);
              botui.message.add({
                delay:1000,
                loading:true,
                type:'embed',
                content:'https://www.youtube.com/embed/0Lfb-zZKTr4'
              }).then(function(){
                log = 'https://www.youtube.com/embed/0Lfb-zZKTr4';
                sendlog(log);
                botui.message.add({
                  delay:1000,
                  loading:true,
                  content:'動画を見終わったらボタンを押してください．'
                }).then(function(){
                  log = '動画を見終わったらボタンを押してください．';
                  sendlog(log);
                  // ボタン表示
                  return botui.action.button({
                    autoHide:false,
                    delay:1000,
                    action:[{icon:'circle-thin', text:'次へ', value:'next'}]
                  }).then(function(res){
                    botui.action.hide();
                    switch(res.value){
                      case 'next':
                        log = res.value;
                        sendlog(log);
                        mvq();
                        break;
                      default:quit();
                    }
                  });
                });
              });
            });
          });
        }else if(message.indexOf('背理法') != -1){
          botui.message.add({
            delay:1000,
            loading:true,
            content:'背理法に関する補足説明動画が見つかりました！'
          }).then(function(){
            log = '背理法に関する補足説明動画が見つかりました！';
            sendlog(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見ることで理解できるかもしれないので，見てみてください！'
            }).then(function(){
              log = '動画を見ることで理解できるかもしれないので，見てみてください！';
              sendlog(log);
              botui.message.add({
                delay:1000,
                loading:true,
                type:'embed',
                content:'https://www.youtube.com/embed/FuAlXYXbflg'
              }).then(function(){
                log = 'https://www.youtube.com/embed/FuAlXYXbflg';
                sendlog(log);
                botui.message.add({
                  delay:1000,
                  loading:true,
                  content:'動画を見終わったらボタンを押してください．'
                }).then(function(){
                  log = '動画を見終わったらボタンを押してください．';
                  sendlog(log);
                  // ボタン表示
                  return botui.action.button({
                    autoHide:false,
                    delay:1000,
                    action:[{icon:'circle-thin', text:'次へ', value:'next'}]
                  }).then(function(res){
                    botui.action.hide();
                    switch(res.value){
                      case 'next':
                        log = res.value;
                        sendlog(log);
                        mvq();
                        break;
                      default:quit();
                    }
                  });
                });
              });
            });
          });
        }else if((message.indexOf('必要条件') != -1) || (message.indexOf('十分条件') != -1)){
          botui.message.add({
            delay:1000,
            loading:true,
            content:'必要条件・十分条件に関する補足説明動画が見つかりました！'
          }).then(function(){
            log = '必要条件・十分条件に関する補足説明動画が見つかりました！';
            sendlog(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見ることで理解できるかもしれないので，見てみてください！'
            }).then(function(){
              log = '動画を見ることで理解できるかもしれないので，見てみてください！';
              sendlog(log);
              botui.message.add({
                delay:1000,
                loading:true,
                type:'embed',
                content:'https://www.youtube.com/embed/E99EgJ5F2Zk'
              }).then(function(){
                log = 'https://www.youtube.com/embed/E99EgJ5F2Zk';
                sendlog(log);
                botui.message.add({
                  delay:1000,
                  loading:true,
                  content:'動画を見終わったらボタンを押してください．'
                }).then(function(){
                  log = '動画を見終わったらボタンを押してください．';
                  sendlog(log);
                  // ボタン表示
                  return botui.action.button({
                    autoHide:false,
                    delay:1000,
                    action:[{icon:'circle-thin', text:'次へ', value:'next'}]
                  }).then(function(res){
                    botui.action.hide();
                    switch(res.value){
                      case 'next':
                        log = res.value;
                        sendlog(log);
                        mvq();
                        break;
                      default:quit();
                    }
                  });
                });
              });
            });
          });
        }else if((message.indexOf('命題') != -1) && ((message.indexOf('逆') != -1) || (message.indexOf('裏') != -1) || (message.indexOf('対偶') != -1))){
          botui.message.add({
            delay:1000,
            loading:true,
            content:'逆・裏・対偶に関する補足説明動画が見つかりました！'
          }).then(function(){
            log = '逆・裏・対偶に関する補足説明動画が見つかりました！';
            sendlog(log);
            botui.message.add({
              delay:1000,
              loading:true,
              content:'動画を見ることで理解できるかもしれないので，見てみてください！'
            }).then(function(){
              log = '動画を見ることで理解できるかもしれないので，見てみてください！';
              sendlog(log);
              botui.message.add({
                delay:1000,
                loading:true,
                type:'embed',
                content:'https://www.youtube.com/embed/hKFF1_h-PtM'
              }).then(function(){
                log = 'https://www.youtube.com/embed/hKFF1_h-PtM';
                sendlog(log);
                botui.message.add({
                  delay:1000,
                  loading:true,
                  content:'動画を見終わったらボタンを押してください．'
                }).then(function(){
                  log = '動画を見終わったらボタンを押してください．';
                  sendlog(log);
                  // ボタン表示
                  return botui.action.button({
                    autoHide:false,
                    delay:1000,
                    action:[{icon:'circle-thin', text:'次へ', value:'next'}]
                  }).then(function(res){
                    botui.action.hide();
                    switch(res.value){
                      case 'next':
                        log = res.value;
                        sendlog(log);
                        mvq();
                        break;
                      default:quit();
                    }
                  });
                });
              });
            });
          });
        }else{
          nomv();
        }
      });
    });
  });
}

// Question4
function q4(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'授業やシステムについて，意見はありますか？'
  }).then(function(){
    log = '授業やシステムについて，意見はありますか？';
    sendlog(log);
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
        sendlog(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'自由に記述してください．'
        }).then(function(){
          log = '自由に記述してください';
          sendlog(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'自由記述'
            }
          }).then(function(res){
            log = res.value;
            sendlog(log);
            end();
          });
        });
      }else{
        log = 'ない';
        sendlog(log);
        end();
      }
    });
  });
}

// 動画を送信した場合
function mvend(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'動画を見終わったらボタンを押してください．'
  }).then(function(){
    log = '動画を見終わったらボタンを押してください．';
    sendlog(log);
    // ボタン表示
    return botui.action.button({
      autoHide:false,
      delay:1000,
      action:[{icon:'circle-thin', text:'次へ', value:'next'}]
    });
  }).then(function(res){
    botui.action.hide();
    switch(res.value){
      case 'next':
        log = '次へ';
        sendlog(log);
        mvq();
        break;
      default:quit();
    }
  });
}

// 動画感想
function mvq(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？'
  }).then(function(){
    log = '送信した補足説明動画を見ることにより，分からない箇所が分かるようになりましたか？';
    sendlog(log);
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
        log = res.value;
        sendlog(log);
        mvgood();
        break;
      case 'no':
        log = res.value;
        sendlog(log);
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
    sendlog(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'特に役に立った部分を教えてください！'
    }).then(function(){
      log = '特に役に立った部分を教えてください！';
      sendlog(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，役に立った内容の動画時間など何でも構いません！'
      }).then(function(){
        log = '説明方法や，役に立った内容の動画時間など何でも構いません！';
        sendlog(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'改善してほしい点もあれば加えて記入してください！'
        }).then(function(){
          log = '改善してほしい点もあれば加えて記入してください！';
          sendlog(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりやすかった．'
            }
          }).then(function(res){
            log = res.value;
            sendlog(log);
            q4();
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
    sendlog(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'良ければ改善点を教えてください！'
    }).then(function(){
      log = '良ければ改善点を教えてください！';
      sendlog(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'説明方法や，分かりにくかった内容の動画時間など何でも構いません．'
      }).then(function(){
        log = '説明方法や，分かりにくかった内容の動画時間など何でも構いません．';
        sendlog(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'よろしくお願いします！'
        }).then(function(){
          log = 'よろしくお願いします！';
          sendlog(log);
          return botui.action.text({
            delay:1000,
            loading:true,
            action:{
              placeholder:'例：2:13の〇〇という説明が分かりにくい．〇〇のような説明を求めます．'
            }
          }).then(function(res){
            log = res.value;
            sendlog(log);
            q4();
          });
        });
      });
    });
  });
}

// 動画ない場合
function nomv(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'うーん・・・'
  }).then(function(){
    log = 'うーん・・・';
    sendlog(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'この部分を解説した補足説明動画はまだないようです．'
    }).then(function(){
      log = 'この部分を解説した補足説明動画はまだないようです．';
      sendlog(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'どのような解説動画があれば理解できると思いますか？'
      }).then(function(){
        log = 'どのような解説動画があれば理解できると思いますか？';
        sendlog(log);
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
            sendlog(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！';
              sendlog(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(){
                log = res.value;
                sendlog(log);
                q4();
              });
            });
          }else if(res.value == '2'){
            log = '例題を用いて';
            sendlog(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！'
            }).then(function(){
              log = '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ問題番号などでも大丈夫です！';
              sendlog(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(){
                log = res.value;
                sendlog(log);
                q4();
              });
            });
          }else if(res.value == '3'){
            log = 'その他（自由記述）';
            sendlog(log);
            botui.message.add({
              delay: 1500,
              loading:true,
              content: 'どのような説明方法を希望しますか？具体的に書いてみてください。'
            }).then(function(){
              log = 'どのような説明方法を希望しますか？具体的に書いてみてください。';
              sendlog(log);
              return botui.action.text({
                delay: 1000,
                loading:true,
                action:{ placeholder: '' }
              }).then(function(){
                log = res.value;
                sendlog(log);
                q4();
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

// 振り返り終了
function end(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'振り返りお疲れ様でした！'
  }).then(function(){
    log = '振り返りお疲れ様でした！';
    sendlog(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'今日はシステム利用についてのアンケートもあります！'
    }).then(function(){
      log = '今日はシステム利用についてのアンケートもあります！';
      sendlog(log);
      botui.message.add({
        delay:1000,
        loading:true,
        content:'そちらも回答よろしくお願いします！'
      }).then(function(){
        log = 'そちらも回答よろしくお願いします！';
        sendlog(log);
        botui.message.add({
          delay:1000,
          loading:true,
          content:'[ココを押して振り返り終了](http://153.126.193.128/chatbot/page/lesson/2019c/main.php)'
        });
      });
    });
  });
}

// 振り返りしない場合
function quit(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'回答を中止しました．期限内に振り返りを行おう！'
  }).then(function(){
    log = '回答を中止しました．期限内に振り返りを行おう！';
    sendlog(log);
    botui.message.add({
      delay:1000,
      loading:true,
      content:'[ここを押して前のページに戻る](http://153.126.193.128/chatbot/page/lesson/2019c/main.php)'
    });
  });
}

})();
