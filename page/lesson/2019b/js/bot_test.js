(function(){

var botui = new BotUI('chat-app');

var message;
var log;

//初期メッセージ
botui.message.add({
  content: 'こんにちは！'
}).then(init);

//質問の選択肢を掲示する関数
function init(){
  botui.message.add({
    delay:1000,
    loading:true,
    content:'振り返りをしましょう！'
  }).then(function(){

    //ボタンを提示
    return botui.action.button({
      autoHide:false,
      delay:1500,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}]
    });
  }).then(function(res){
    botui.action.hide();
    switch (res.value){
      case 'yes':
        log = 'はい';
        retrospective();
        break;
      case 'no':
        log = 'いいえ';

        end2();
        break;
      default:end();
    }
  });
}

// YESの場合
function retrospective(){
  botui.message.add({
    delay: 1500,
    loading:true,
    content: '今回の予習は〇〇〇〇〇でした.'
  }).then(function(){
    botui.message.add({
      delay:1500,
      loading:true,
      content: '全ての範囲を事前に予習しましたか？'
    });
  }).then(function(){
    // ボタン
    return botui.action.button({
      autoHide: false,
      delay: 1500,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}
      ]
    });
  }).then(function(res){
    botui.action.hide();
    switch (res.value){
      case 'yes':
        log = 'はい';

        retrospective2();
        break;
      case 'no':
        log = 'いいえ';

        retrospective2();
        break;
      default:end();
    }
  });
}

// 続き
function retrospective2(){
  log = '今までの順列・組合せの範囲で分からない箇所はありましたか？';

  botui.message.add({
    delay: 1500,
    loading:true,
    content: '今回の事前学習で分からない箇所はありましたか？'
  }).then(function(){
    // ボタン
    return botui.action.button({
      autoHide: false,
      delay: 1500,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}
      ]
    });
  }).then(function(res){
    botui.action.hide();
    switch (res.value){
      case 'yes':
        log = 'はい';

        retrospective3();
        break;
      case 'no':
        log = 'いいえ';

        end();
        break;
      default:end();
    }
  });
}

// 続き
function retrospective3(){
  log = '分からない箇所はどんな所でしたか？具体的に書いてみてください。';


  botui.message.bot({
    delay:1500,
    loading:true,
    content:'分からない箇所はどんな所でしたか？具体的に書いてみてください。'
  }).then(function(){
    return botui.action.text({
      delay:1000,
      action:{
        placeholder: '例: 二項定理の利用場面'
      }
    });
  }).then(function(res){
    log = res.value;


    message = res.value;
    if((message.indexOf('必要条件') != -1) || (message.indexOf('十分条件') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '必要条件・十分条件に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/E99EgJ5F2Zk'
      });
      log = '必要条件・十分条件に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('逆') != -1) || (message.indexOf('裏') != -1) || (message.indexOf('対偶') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '逆・裏・対偶に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/hKFF1_h-PtM'
      });
      log = '逆・裏・対偶に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if(message.indexOf('背理法') != -1){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '背理法に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/FuAlXYXbflg'
      });
      log = '背理法に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if(message.indexOf('数学的帰納法') != -1){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '数学的帰納法に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/0Lfb-zZKTr4'
      });
      log = '数学的帰納法に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('ベクトルの内積') != -1) || (message.indexOf('内積') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: 'ベクトルの内積に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/Gz65dWly344'
      });
      log = 'ベクトルの内積に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if(message.indexOf('位置ベクトル') != -1){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '位置ベクトルに関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/W45jey6QJ4E'
      });
      log = '位置ベクトルに関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('ベクトル') != -1) && (message.indexOf('図形') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: 'ベクトルと図形に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/KVSqMfHaoCc'
      });
      log = 'ベクトルと図形に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if(message.indexOf('ベクトル方程式') != -1){
      botui.message.add({
        delay:1500,
        loading:true,
        content: 'ベクトル方程式に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/3Nc10Q0Xd-E'
      });
      log = 'ベクトル方程式に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('ベクトル') != -1) && (message.indexOf('応用') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: 'ベクトルの応用に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/t45XjjISOxk'
      });
      log = 'ベクトルの応用に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('行列') != -1) && ((message.indexOf('和') != -1) || (message.indexOf('差') != -1) || (message.indexOf('実数倍') != -1) || (message.indexOf('積') != -1))){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '行列の和・差・実数倍・積に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/hCvlSF4i-RM'
      });
      log = '行列の和・差・実数倍・積に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if(((message.indexOf('ケーリー') != -1) || (message.indexOf('ハミルトン') != -1))){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '行列 ケーリー・ハミルトンの定理関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/yGOtzeqB49Q'
      });
      log = '行列 ケーリー・ハミルトンの定理関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('場合の数') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '場合の数に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/264GkHFM27Y'
      });
      log = '場合の数に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('npr') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: 'nPrに関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/N24cC9UmKBA'
      });
      log = 'nPrに関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('重複順列') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '重複順列に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/HN_eJBSFsjs'
      });
      log = '重複順列に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('ncr') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: 'nCrに関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/3Wnl0KWfG5c'
      });
      log = 'nCrに関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('円順列') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '円順列に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/bV7jkjjyzqs'
      });
      log = '円順列に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('重複組み合わせ') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '重複組み合わせに関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/3yECPH9vv1k'
      });
      log = '重複組み合わせに関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('二項定理') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '二項定理に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/G6HBZuRr-p8'
      });
      log = '二項定理に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('多項定理') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '多項定理に関する動画があります！動画を見て理解できるかもしれないので見てみてください！'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/uHvkaVk5yJk'
      });
      log = '多項定理に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else if((message.indexOf('未来デザイナー') != -1)){
      botui.message.add({
        delay:1500,
        loading:true,
        content: '加藤さんの動画です．'
      });
      botui.message.add({
        delay: 1500,
        loading:true,
        type: 'embed',
        content: 'https://www.youtube.com/embed/o2rTuK-_fBE'
      });
      log = '多項定理に関する動画があります！動画を見て理解できるかもしれないので見てみてください！';


      review();
    }else{
      newVideoQuestion();
    }
  });
}

// 動画制作希望の場合
function newVideoQuestion(){
  botui.message.add({
    delay:1500,
    loading:true,
    content: 'そうですか・・・ この部分を解説した補足動画はまだないようですが、どのような動画があれば理解できそうですか？'
  }).then(function(){
    log = 'そうですか・・・ この部分を解説した補足動画はまだないようですが、どのような動画があれば理解できそうですか？';


    //ボタンを提示
    return botui.action.button({
      autoHide:false,
      delay:1500,
      action:[
        {icon:'superscript', text:'公式の説明', value:'1'},
        {icon:'question', text:'例題を用いて説明', value:'2'},
        {icon:'pencil', text:'その他（自由記述）', value:'3'}
      ]
    });
  }).then(function(res){
    botui.action.hide();
    switch (res.value){
      case '1':
        log = '公式の説明';

        formula();
        break;
      case '2':
        log = '例題を用いて説明';

        example();
        break;
      case '3':
        log = 'その他（自由記述）';

        description();
        break;
      default:end();
    }
  });
}

// 公式
function formula(){
  log = '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ ”なし” と記入してください．'


  botui.message.add({
    delay: 1500,
    loading:true,
    content: '特に説明してほしい公式を書いてみてください。具体的に思いつかなければ ”なし” と記入してください．'
  }).then(function(){
    return botui.action.text({
      delay: 1500,
      action:{ placeholder: '' }
    });
  }).then(function(res){
    log = res.value;


    end();
  });
}

// 例題
function example(){
  log = '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ”なし” と記入してください。';


  botui.message.add({
    delay: 1500,
    loading:true,
    content: '特に説明してほしい例題を書いてみてください。具体的に思いつかなければ”なし” と記入してください。'
  }).then(function(){
    return botui.action.text({
      delay: 1500,
      action:{ placeholder: '例：eラーニング第○回の○問目の解説' }
    });
  }).then(function(res){
    log = res.value;


    end();
  });
}


// 自由記述
function description(){
  log = 'どのような説明方法を希望しますか？具体的に書いてみてください。';


  botui.message.add({
    delay:1500,
    loading:true,
    content:'どのような説明方法を希望しますか？具体的に書いてみてください。'
  }).then(function(){
    return botui.action.text({
      delay:1000,
      action:{
        placeholder: ''
      }
    });
  }).then(function(res){
    log = res.value;


    end();
  });
}

function review(){
  log = '動画は学習の役に立ちましたか？';


  botui.message.add({
    delay:1500,
    loading:true,
    content:'動画は学習の役に立ちましたか？'
  }).then(function(){

    //ボタンを提示
    return botui.action.button({
      autoHide:false,
      delay:1500,
      action:[
        {icon:'circle-thin', text:'はい', value:'yes'},
        {icon:'times', text:'いいえ', value:'no'}]
    });
  }).then(function(res){
    botui.action.hide();
    switch (res.value){
      case 'yes':
        log = 'はい';

        reason1();
        break;
      case 'no':
        log = 'いいえ';

        reason2();
        break;
      default:end();
    }
  });
}

// 役に立たった理由を聞くとこ
function reason1(){
  log = '特に役に立ったと思う部分について教えてください！説明方法や、役に立った動画の時間など、なんでも構いません。 改善点してほしい点もあれば記入してください。';


  botui.message.bot({
    delay:1500,
    loading:true,
    content:'特に役に立ったと思う部分について教えてください！説明方法や、役に立った動画の時間など、なんでも構いません。 改善点してほしい点もあれば記入してください。'
  }).then(function(){
    return botui.action.text({
      delay:1000,
      action:{
        placeholder: ''
      }
    });
  }).then(function(res){
    log = res.value;

    end();
  });
}

// 役に立たなかった理由を聞くとこ
function reason2(){
  log = '役に立たなかったと思う理由を教えてください！説明方法や、分かりにくかった動画の時間など、なんでも構いません。 良かった点もあれば記入してください！';


  botui.message.bot({
    delay:1500,
    loading:true,
    content:'役に立たなかったと思う理由を教えてください！説明方法や、分かりにくかった動画の時間など、なんでも構いません。 良かった点もあれば記入してください！'
  }).then(function(){
    return botui.action.text({
      delay:1000,
      action:{
        placeholder: ''
      }
    });
  }).then(function(res){
    log = res.value;


    end();
  });
}

// 終了
function end(){
  log = '振り返りお疲れ様です！';

  botui.message.add({
    delay: 1500,
    loading:true,
    content: '振り返りお疲れ様です！'
  }).then(function(){
    log = '記録を保存しました。';

    botui.message.add({
      delay: 1500,
      loading:true,
      content: '回答を保存しました。'
    });
  }).then(function(){
    log = 'また使ってね！';

    botui.message.add({
      delay: 1500,
      loading:true,
      content: 'また使ってね！'
    });
  });
}

// 振り返りしなかった人
function end2(){
  log = '次回授業までに振り返りを行いましょう．';

  botui.message.add({
    delay: 1500,
    loading:true,
    content: '次回授業までに振り返りを行いましょう．'
  }).then(function(){
    botui.message.add({
      content: '[終了するにはココをクリック](https://takagi-lab.tk/chatbot/page/lesson/2019b/)'
    });
  });
}

// function sendlog(log){
//   var xhr = new XMLHttpRequest();
//
//   xhr.open('GET', url + log);
//   xhr.onload = function(){
//   }
//   xhr.send();
// }


// function exitlog(){
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', '../api/exit.php?exit=five');
//   xhr.onload = function(){}
//   xhr.send();
// }

})();
