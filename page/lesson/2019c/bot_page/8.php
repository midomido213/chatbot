<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["NAME"]) && !isset($_SESSION["ID"])) {
    header("Location: http://153.126.193.128/chatbot/page/Logout.php");
    exit;
}

$directory_path = "../log/" . $_SESSION["NAME"];
// if(file_exists($directory_path)){
//     //存在したときの処理
//     // echo "作成しようとしたディレクトリは既に存在します";
// }else{
//     //存在しないときの処理（「$directory_path」で指定されたディレクトリを作成する）
//     if(mkdir($directory_path, 0777, true)){
//         //作成したディレクトリのパーミッションを確実に変更
//         chmod($directory_path, 0777);
//         //作成に成功した時の処理
//         // echo "ディレクトリの作成に成功しました";
//     }else{
//         //作成に失敗した時の処理
//         // echo "ディレクトリの作成に失敗しました";
//     }
// }

// ログ用ファイル作成
$filename = '../log/2019c8/' . $_SESSION["NAME"] . '.txt';
// var_dump($filename);
if(file_exists($filename)){

}else{
  touch($filename);
}
?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
      <title>情報基礎数学botのページ</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <link rel="stylesheet" href="../css/botui.min.css" />
      <link rel="stylesheet" href="../css/botui-theme-test.css" />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

      <link rel="stylesheet" href="http://153.126.193.128/chatbot/page/css/style.css" />

      <!-- UIkit CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />

      <!-- UIkit JS -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>
  </head>
  <body class="background">

    <section class="uk-section uk-dark uk-background-cover">

      <div class="title">
        <p><?php echo($_SESSION["NAME"]); ?> でログイン中</p>
      </div>


      <!-- メイン表示部分 -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>第８回 事前学習振り返りページ</h3>
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
                <a href="../main.php">ココを押して前のページに戻る</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </section>

    <script src="https://cdn.jsdelivr.net/vue/latest/vue.min.js"></script>
    <script src="../js/botui.min.js"></script>
    <script src="../js/8.js"></script>

  </body>
</html>
