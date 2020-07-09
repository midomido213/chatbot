<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://tkg-lab.tk/chatbot/page/Logout.php");
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
      <link rel="stylesheet" href="../css/botui-theme-origin.css" />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

      <link rel="stylesheet" href="https://tkg-lab.tk/chatbot/page/css/style.css" />

      <!-- BULMA CDN -->
      <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js" defer ></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css" />
  </head>
  <body>
    <!-- header -->
    <header class="navbar">
      <div class="navbar-brand">
          <span class="navbar-item">
              <span class="fas fa-robot"></span>チャットボットを利用した振り返り
          </span>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <p><?php echo($_SESSION["userId"]); ?> でログイン中</p>
        </div>
        <div class="navbar-item">
          <a href="https://tkg-lab.tk/chatbot/page/Logout.php"><i class="fa fa-user"></i>ログアウト</a>
        </div>
      </div>
    </header>

    <!-- ライン -->
    <div class="hero is-info is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">第４回 学習振り返りページ</h1>
          <h2 class="subtitle">＠２０２０年度情報基礎数学C</h2>
        </div>
      </div>
    </div>

    <!-- メイン表示部分 -->
    <main class="columns">
      <div class="submenu column is-3">
        <!-- side bar -->
        <aside class="box">
          情報基礎数学Cでは、毎回の学習をチャットボットを利用して振り返りしてもらいます。画面に従い振り返りを進めてください。
        </aside>
        <aside class="box menu">
           <p class="menu-label">
              各種リンク
           </p>
           <ul class="menu-list">
               <li><a href="https://tkg-lab.tk/g031o008/plan/view/main/index.php">学習計画の作成</a></li>
               <li><a href="https://www.ipusoft-el.jp/mdl/">岩手県立大学Moodle</a></li>
               <li><a href="https://solomon.uela.cloud/">共通基盤教育システム</a></li>
            </ul>
         </aside>
 　　　</div>
      <div class="column">
        <!-- チャット部分 -->
        <article class="box media">
           <div class="media-content">
              <div class="content">
                <div class="botui-app-container" id="chat-app">
                  <!-- チャットの表示  -->
                  <?php
                  // 振り返り済みチェック
                  require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');
                  $name = $_SESSION['userId'];
                  $classDate = new DateTime('2020-06-12 00:00:00', new DateTimeZone('Asia/Tokyo'));
                  $classDate = $classDate->format('U');
                  $classDate .= "000";
                  $errorMessage = '';
                  $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $ishi['host'], $ishi['dbname']);
                  try{
                    $pdo = new PDO($dsn, $ishi['user'], $ishi['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
                    $stmt = $pdo->prepare('SELECT COUNT(id) FROM chatbot WHERE userId = ? AND classDate = ?');
                    $stmt->execute(array($name, $classDate));
                    $check = $stmt->fetchColumn();

                    if($check > 0){
                      echo '<p>振り返り登録済みです。</p>';
                      echo '<p>振り返り履歴ページに遷移します・・・（５秒後）</p>';
                      header("refresh:5;url=https://tkg-lab.tk/chatbot/page/lesson/2020c/history/");
                    }else{
                      echo '<bot-ui></bot-ui>';
                    }

                  }catch(PDOException $e){
                    $errorMessage = 'エラーです。';
                    echo $errorMessage;
                    echo var_dump($name);
                    echo var_dump($classDate);
                    echo var_dump($check);
                  }
                  ?>
                </div>
              </div>
           </div>
        </article>
        <article class="box media">
           <div class="media-content">
              <div class="content">
                 <p><strong>チャット画面が表示されない場合は？</strong></p>
                 <p>お使いのブラウザを確認してみてください。推奨ブラウザはGoogleChromeです。</p>
                 <p>JavaScriptが有効になっているか確認してみてください。</p>
              </div>
           </div>
        </article>
　　　 </div>
　　 </main>

    <!-- footer -->
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
           <p>takagi-lab</p>
        </div>
      </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/vue/latest/vue.min.js"></script>
    <script src="../js/botui.min.js"></script>
    <script src="../js/4.js"></script>

  </body>
</html>
