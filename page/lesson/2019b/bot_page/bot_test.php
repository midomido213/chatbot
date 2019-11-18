<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: http://153.126.193.128/chatbot/page/Logout.php");
    exit;
}

$directory_path = "../log/" . $_SESSION["userId"];
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
// $filename = '../log/2018b14/' . $_SESSION["NAME"] . '_2018b14.txt';
// if(file_exists($filename)){
//
// }else{
//   touch($filename);
// }
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

    <section class="uk-section uk-dark uk-background-cover" style="background-image: url(images/cover.jpg)">

      <div class="title">
        <p><?php echo($_SESSION["userId"]); ?> でログイン中</p>
      </div>


      <!-- メイン表示部分 -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>チャットボットお試しページ（動作確認用）</h2>
              <div class="botui-app-container" id="chat-app">
              <!-- チャットの表示  -->
              <bot-ui></bot-ui>
            </div>
          </div>
        </div>
      </section>

    </section>

    <script src="https://cdn.jsdelivr.net/vue/latest/vue.min.js"></script>
    <script src="../js/botui.min.js"></script>
    <script src="../js/bot_test.js"></script>

  </body>
</html>
