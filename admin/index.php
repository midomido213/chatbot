<?php
session_start();
require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://takagi-lab.tk/chatbot/page/Logout.php");
    exit;
}

// 管理者以外を弾く
$name = $_SESSION['userId'];
$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
  $stmt = $pdo->prepare('SELECT admin FROM userData WHERE name = ?');
  $stmt->execute(array($name));
  $admin = $stmt->fetchColumn();

  if($admin != 1){
    header("Location: https://takagi-lab.tk/chatbot/page/lesson/2019c/index.php");
    exit;
  }
}catch(PDOException $e){

}

$errorMessage = '';

?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>情報基礎数学botのページ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- UIkit CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />
    <link rel="stylesheet" href="https://takagi-lab.tk/chatbot/page/css/style.css" />

    <!-- UIkit JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>

  </head>
  <body class="background">
    <!-- 通知 -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.9/push.min.js"></script>

    <section class="uk-section uk-dark uk-background-cover">

      <div class="title">
        <h3>情報基礎数学 チャットボットによる振り返りシステム</h3>
        <h3>２０１９年度 情報基礎数学Ｂ</h3>
        <p><?php echo($_SESSION["userId"]); ?> でログイン中</p>
      </div>

      <!-- お知らせ -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>お知らせ</h3>
            <p>システムにアクセスありがとうございます．</p>
            <p>TA・SAはチャットログを確認し，必要に応じて個別対応をお願いします．</p>
            <p>何か分からないことがあれば，小菅まで問い合わせください．</p>
            <p>g231r010@s.iwate-pu.ac.jp</p>
            <!-- ブラウザ判定 -->
            <?php
            // 判定するのに小文字にする
            $browser = strtolower($_SERVER['HTTP_USER_AGENT']);

            // ユーザーエージェントの情報を基に判定
            if (strstr($browser , 'edge')) {
                // echo('ご使用のブラウザはEdgeです。');
            } elseif (strstr($browser , 'trident') || strstr($browser , 'msie')) {
                echo('<p>※注意※ご使用のブラウザはInternet Explorerです。</p>');
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
          </div>
        </div>
      </section>

      <!-- メイン表示部分 -->
      <?php
      $name = $_SESSION['userId'];
      $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
      try{
        $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
        $stmt = $pdo->prepare('SELECT admin FROM userData WHERE name = ?');
        $stmt->execute(array($name));
        $admin = $stmt->fetchColumn();
        if($admin == 1){
          echo '<!-- 管理者表示 --><section class="uk-section uk-section-xsmall"><div class="uk-container"><div class="uk-card uk-card-secondary uk-card-body"><h3>管理者限定表示</h3><ul class="uk-list">';
          echo '<li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="location.href=\'https://takagi-lab.tk/chatbot/admin/log/\'">チャットログ閲覧ページ</button></li>';
          // echo '<li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="location.href=\'bot_page/bot_dev.php\'">チャットボット開発動作確認ページ</button></li>';
          // echo '<li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="location.href=\'#\'">ユーザー管理（準備中）</button></li>';
          echo '</ul></div></div></section>';
        }
      }catch(PDOException $e){
        $errorMessage = 'エラーです';
      }

      ?>

      <!-- 操作 -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>その他　リンク</h3>
            <div>
              <ul class="uk-list">
                <li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="window.open('https://takagi-lab.tk/g031o008/plan/view/main/index.php', '_blank')">学習計画の作成</button></li>
                <li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="window.open('https://www.ipusoft-el.jp/mdl/', '_blank')">岩手県立大学Moodleへのリンク</button></li>
                <li><button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" onclick="window.open('https://solomon.uela.cloud/', '_blank')">共通基盤教育システムへのリンク</button></li>
                <li><button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom" onclick="location.href='../../index.php'">トップページに戻る</button></li>
                <li><button class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom" onclick="location.href='http://153.126.193.128/chatbot/page/Logout.php'">ログアウト</button></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </section>

  </body>
</html>
