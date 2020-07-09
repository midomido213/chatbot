<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://tkg-lab.tk/chatbot/page/Logout.php");
    exit;
}
?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>情報基礎数学botのページ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="css/style.css" />

    <!-- UIkit CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />

    <!-- UIkit JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>

  </head>
  <body class="background">

    <section class="uk-section uk-dark uk-background-cover">

      <div class="title">
        <h3>情報基礎数学 チャットボットによる振り返りシステム</h3>
        <p><?php echo($_SESSION["userId"]); ?> でログイン中</p>
      </div>

      <!-- お知らせ -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>お知らせ</h3>
            <!-- ブラウザ判定 -->
            <?php
            // 判定するのに小文字にする
            $browser = strtolower($_SERVER['HTTP_USER_AGENT']);

            // ユーザーエージェントの情報を基に判定
            if (strstr($browser , 'edge')) {
                // echo('ご使用のブラウザはEdgeです。');
            } elseif (strstr($browser , 'trident') || strstr($browser , 'msie')) {
                echo('<p>ご使用のブラウザはInternet Explorerです。</p>');
                echo('<p>InternetExplorerではシステムが動作しない可能性があります．</p>');
                echo('<p>推奨ブラウザは <a href="https://www.google.com/intl/ja_ALL/chrome/" target="_blank">GoogleChrome</a> です．</p>');
            } elseif (strstr($browser , 'chrome')) {
                // echo('ご使用のブラウザはGoogle Chromeです。');
            } elseif (strstr($browser , 'firefox')) {
                // echo('ご使用のブラウザはFirefoxです。');
            } elseif (strstr($browser , 'safari')) {
                // echo('ご使用のブラウザはSafariです。');
            } elseif (strstr($browser , 'opera')) {
                // echo('ご使用のブラウザはOperaです。');
            } else {
                echo('不明。');
            }
            ?>
            <p>最初に授業選択から，履修している授業科目を選択してください．</p>
          </div>
        </div>
      </section>

      <!-- メイン表示部分 -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>授業選択</h3>
            <div>
              <ul class="uk-list">
                <li><button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom" onclick="location.href='lesson/2019b/'">2019年度 情報基礎数学B</button></li>
                <li><button class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom" onclick="location.href='lesson/2019c/'">2019年度 情報基礎数学C（アーカイブ）</button></li>
                <li><button class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom" onclick="location.href='lesson/2018b/index.php'">2018年度 情報基礎数学B（アーカイブ）</button></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ログアウト -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>その他</h3>
            <div>
              <ul class="uk-list">
                <li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="window.open('https://www.ipusoft-el.jp/mdl/', '_blank')">岩手県立大学Moodleへのリンク</button></li>
                <li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="window.open('https://solomon.uela.cloud/', '_blank')">共通基盤教育システムへのリンク</button></li>
                <li><button class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom" onclick="location.href='Logout.php'">ログアウト</button></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </section>

  </body>
</html>
