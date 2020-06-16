<?php
session_start();

require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://tkg-lab.tk/chatbot/page/Logout.php");
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
    header("Location: https://tkg-lab.tk/chatbot/page/lesson/2019c/index.php");
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
    <div class="hero is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">情報基礎数学 計画/振り返りシステム 管理画面</h1>
          <h2 class="subtitle">＠確認テスト・再テスト 点数確認ページ</h2>
        </div>
      </div>
    </div>

    <!-- メイン表示部分 -->
    <main class="columns">
      <div class="submenu column is-3">
        <!-- side bar -->
        <aside class="box">
          <p>各学生のテストデータを閲覧できるページです。</p>
          <p>参考にし、個別指導を行ってください。</p>
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
                <p><strong>第２回　確認テスト・再テスト　点数確認画面</strong></p>
                <table class="table">
                  <thead>
                    <tr>
                      <th><abbr title="user">ユーザー名</abbr></th>
                      <th><abbr title="group">グループ</abbr></th>
                      <th><abbr title="exam1">確認テスト第１問（１）</abbr></th>
                      <th><abbr title="exam2">確認テスト第１問（２）</abbr></th>
                      <th><abbr title="exam3">確認テスト第２問</abbr></th>
                      <th><abbr title="exam4">確認テスト第３問</abbr></th>
                      <th><abbr title="exam5">確認テスト第４問</abbr></th>
                      <th><abbr title="exam6">確認テスト第５問</abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php
                    $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
                    $userId = $_SESSION['userId'];
                    try{
                      $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

                      $stmt = $pdo->prepare('SELECT * FROM `exam2020c` INNER JOIN groupData2020c ON exam2020c.name = groupData2020c.userName ORDER BY groupData2020c.id');
                      $stmt->execute();

                      while ($row = $stmt->fetch()) {
                    ?>
                    <tr>
                      <th><?php echo nl2br($row['name']); ?></th>
                      <th>グループ<?php echo nl2br($row['groupId']); ?></th>
                      <td><?php echo nl2br($row['exam1']); ?></td>
                      <td><?php echo nl2br($row['exam2']); ?></td>
                      <td><?php echo nl2br($row['exam3']); ?></td>
                      <td><?php echo nl2br($row['exam4']); ?></td>
                      <td><?php echo nl2br($row['exam5']); ?></td>
                      <td><?php echo nl2br($row['exam6']); ?></td>
                    </tr>
                    <?php
                          }
                        }catch(PDOException $e){
                          $errorMessage = 'エラーです';
                        }
                    ?>
                  </tbody>
                </table>
              </div>
           </div>
        </article>
        <article class="box media">
           <div class="media-content">
              <div class="content">
                 <p><strong>前のページに戻る</strong></p>
                 <button class="button is-primary" onclick="location.href='https://tkg-lab.tk/chatbot/admin/'">こちらをクリック</button>
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
