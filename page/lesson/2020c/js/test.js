(function(){

  var botui = new BotUI('chat-app');

  init();

  function init(){
    botui.message.add({
      photo:true,
      content:'こんにちは！'
    });
  }

})();
