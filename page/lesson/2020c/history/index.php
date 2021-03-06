<?php
session_start();

require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

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
      <link rel="stylesheet" href="https://tkg-lab.tk/chatbot/page/css/table.css" />

      <!-- BULMA CDN -->
      <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js" defer ></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css" />
      <!-- BULMA JS -->
      <script src="https://cdn.jsdelivr.net/npm/vue-bulma-accordion@0.4.8/dist/vue-bulma-accordion.umd.min.js"></script>

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
    <div class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">過去の振り返り確認ページ</h1>
          <h2 class="subtitle">＠２０２０年度情報基礎数学C</h2>
        </div>
      </div>
    </div>

    <!-- メイン表示部分 -->
    <main class="columns">
      <div class="submenu column is-3">
        <!-- side bar -->
        <aside class="box">
          ここでは過去に行った振り返りの履歴を見ることができます。
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
        <article class="box media">
           <div class="media-content">
              <div class="content">
                <p><strong>確認画面</strong></p>

                <!-- 表示部分 -->
                <div id="app">
                  <bulma-accordion>
                <?php
                  $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
                  $userId = $_SESSION['userId'];
                  try{
                    $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

                    $stmt = $pdo->prepare('SELECT * FROM `chatLog2020c` WHERE name = ?');
                    $stmt->execute(array($userId));

                    while ($row = $stmt->fetch()) {
                ?>
                      <bulma-accordion-item>
                        <div slot="title">
                          <h3>第<?php echo nl2br($row['lesson']); ?>回 振り返り履歴</h3>
                          <p>回答時間：<?php echo $row['timestamp']; ?></p>
                        </div>
                        <div slot="content">
                         <?php echo nl2br($row['logAll']); ?>
                       </div>
                      </bulma-accordion-item>

                <?php
                      }
                    }catch(PDOException $e){
                      $errorMessage = 'エラーです';
                    }
                ?>
                  </bulma-accordion>
                </div>

              </div>

           </div>
        </article>
        <article class="box media">
           <div class="media-content">
              <div class="content">
                 <p><strong>前のページに戻る</strong></p>
                 <button class="button is-primary" onclick="location.href='https://tkg-lab.tk/g031o008/plan/view/main/index.php'">こちらをクリック</button>
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
    <script src="../js/bulma-accordion.js"></script>

  </body>
</html>
