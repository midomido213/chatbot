<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://takagi-lab.tk/chatbot/page/Logout.php");
    exit;
}

date_default_timezone_set('Asia/Tokyo');
?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
      <title>情報基礎数学botのページ</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <link rel="stylesheet" href="../css/botui.min.css" />
      <link rel="stylesheet" href="../css/botui-theme-default.css" />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

      <link rel="stylesheet" href="https://takagi-lab.tk/chatbot/page/css/style.css" />

      <!-- UIkit CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />

      <!-- UIkit JS -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>
  </head>
  <body class="background">

    <section class="uk-section uk-dark uk-background-cover">

      <div class="title">
        <p><?php echo($_SESSION["userId"]); ?> でログイン中</p>
      </div>


      <!-- メイン表示部分 -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>第１回 学習振り返りページ</h3>
              <div class="botui-app-container" id="chat-app">
              <!-- チャットの表示  -->
              <bot-ui></bot-ui>
              <!-- <p>不正なアクセスです</P> -->
            </div>
          </div>
        </div>
      </section>

      <!-- 注意書き -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-hover uk-card-body">
            <div class="uk-inline">
              <button class="uk-button uk-button-default" type="button">※上にチャット画面が表示されない場合</button>
              <div uk-dropdown="mode: click">
                <p>お使いのブラウザを確認してみてください．</p>
                <p>JavaScriptが有効になっているか確認してみてください．</p>
                <p>分からなければ近くのTA/SAに聞いてください．</p>
                <a href="../index.php">ココを押して前のページに戻る</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </section>

    <script src="https://cdn.jsdelivr.net/vue/latest/vue.min.js"></script>
    <script src="../js/botui.min.js"></script>
    <script src="../js/test.js"></script>

  </body>
</html>
