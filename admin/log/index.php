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


//DB登録処理
$comment = $_POST['comment'];
$student = $_POST['student'];
$ta = $_POST['ta'];
$chatId = $_POST['chatId'];
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('INSERT INTO taComment (student, ta, comment) VALUES (?, ?, ?)');
  $stmt->execute(array($student, $ta, $comment));
  $stmt = $pdo->prepare('UPDATE chatLog SET support = 1 where id = ?');
  $stmt->execute(array($chatId));

  $alert = '<div class="uk-alert-success" uk-alert><a class="uk-alert-close" uk-close></a><p>TA/SA 対応状況の登録が完了しました。</p><p>対応済みに変更しました。</p></div>';
}catch(PDOException $e){

}

?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
      <title>情報基礎数学botのページ</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

      <link rel="stylesheet" href="https://takagi-lab.tk/chatbot/page/css/style.css" />
      <link rel="stylesheet" href="https://takagi-lab.tk/chatbot/page/css/table.css" />

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
          <a href="https://takagi-lab.tk/chatbot/page/Logout.php"><i class="fa fa-user"></i>ログアウト</a>
        </div>
      </div>
    </header>

    <!-- ライン -->
    <div class="hero is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">情報基礎数学 計画/振り返りシステム 管理画面</h1>
          <h2 class="subtitle">＠チャットログ閲覧ページ</h2>
        </div>
      </div>
    </div>

    <!-- メイン表示部分 -->
    <main class="columns">
      <div class="submenu column is-3">
        <!-- side bar -->
        <aside class="box">
          <p>各学生のチャットログを閲覧できるページです。</p>
          <p>チャットログを参考にし、個別指導を行ってください。</p>
        </aside>
        <aside class="box menu">
           <p class="menu-label">
              各種リンク
           </p>
           <ul class="menu-list">
               <li><a href="https://takagi-lab.tk/g031o008/plan/view/main/index.php">学習計画の作成</a></li>
               <li><a href="https://www.ipusoft-el.jp/mdl/">岩手県立大学Moodle</a></li>
               <li><a href="https://solomon.uela.cloud/">共通基盤教育システム</a></li>
            </ul>
         </aside>
 　　　</div>
      <div class="column">
        <article class="box media">
           <div class="media-content">
              <div class="content">
                 <p>理解度について</p>
                 <p>理解度に応じてチャットログの背景色を変えています。</p>
                 <span class="tag is-large" style="background:#ee5253">理解度0：全く理解ができていない</span>
                 <span class="tag is-large" style="background:#ff6b6b">理解度1：まだ分からない箇所が多く不安である</span>
                 <span class="tag is-large" style="background:#feca57">理解度2：少し理解しているが、曖昧な箇所もありどちらともいえない</span>
                 <span class="tag is-large" style="background:#48dbfb">理解度3：概ね理解しており、不安が少ない</span>
                 <span class="tag is-large" style="background:#1dd1a1">理解度4：今回の範囲に関しては完璧に理解している</span>
              </div>
           </div>
        </article>
        <article class="box media">
           <form action="index.php" method="post">
             <div class="field">
               <label class="label">授業回</label>
               <div class="select">
                 <select name="lesson">
                   <option>1</option>
                   <option>2</option>
                   <option>3</option>
                   <option>4</option>
                 </select>
               </div>
             </div>
             <div class="field">
               <label class="label">グループ</label>
               <div class="select">
                 <select name="group">
                   <option>1</option>
                   <option>2</option>
                   <option>3</option>
                   <option>4</option>
                   <option>5</option>
                   <option>6</option>
                   <option>7</option>
                   <option>8</option>
                   <option>9</option>
                   <option>10</option>
                 </select>
               </div>
              </div>
              <button class="button is-primary">Submit</button>
           </form>
        </article>
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
                  $groupId = $_POST['group'];
                  $lesson = $_POST['lesson'];
                  try{
                    $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

                    $stmt = $pdo->prepare('SELECT chatLog2020c.id AS id, chatLog2020c.name AS name, chatLog2020c.lesson AS lesson, chatLog2020c.level AS level, chatLog2020c.logAll AS logAll, chatLog2020c.timestamp AS timestamp, groupData2020c.userName AS name, groupData2020c.groupId AS groupId FROM chatLog2020c INNER JOIN groupData2020c ON groupData2020c.userName = chatLog2020c.name  WHERE groupId = ? AND lesson = ? ORDER BY level > 0 DESC, level ASC;');
                    $stmt->execute(array($groupId, $lesson));

                    while ($row = $stmt->fetch()) {
                ?>
                      <bulma-accordion-item class="level<?php echo nl2br($row['level']); ?>">
                        <div slot="title">
                          <p>第<?php echo nl2br($row['lesson']); ?>回 振り返り履歴　ユーザー：<?php echo nl2br($row['name']); ?></p>
                          <p>理解度:<?php echo nl2br($row['level']); ?></p>
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
                 <button class="button is-primary" onclick="location.href='https://takagi-lab.tk/chatbot/admin/'">こちらをクリック</button>
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
    <script src="https://takagi-lab.tk/chatbot/page/lesson/2020c/js/bulma-accordion.js"></script>

  </body>
