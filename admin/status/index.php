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
          <h2 class="subtitle">＠振り返り状況確認ページ</h2>
        </div>
      </div>
    </div>

    <!-- メイン表示部分 -->
    <main class="columns">
      <div class="submenu column is-3">
        <!-- side bar -->
        <aside class="box">
          <p>各学生の振り返り状況を閲覧できるページです。</p>
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
                <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th><abbr title="user">ユーザー名</abbr></th>
                      <th><abbr title="group">グループ</abbr></th>
                      <th><abbr title="nine">第２回</abbr></th>
                      <th><abbr title="nine">第３回</abbr></th>
                      <th><abbr title="nine">第４回</abbr></th>
                      <th><abbr title="nine">第５回</abbr></th>
                      <th><abbr title="nine">第６回</abbr></th>
                      <th><abbr title="nine">第７回</abbr></th>
                      <th><abbr title="nine">第８回</abbr></th>
                      <th><abbr title="nine">第９回</abbr></th>
                      <th><abbr title="ten">第１０回</abbr></th>
                      <th><abbr title="eleven">第１１回</abbr></th>
                      <th><abbr title="twelve">第１２回</abbr></th>
                      <th><abbr title="thirteen">第１３回</abbr></th>
                      <th><abbr title="fourteen">第１４回</abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php
                      $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
                      $userId = $_SESSION['userId'];
                      try{
                        $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

                        $stmt = $pdo->prepare('SELECT * FROM status INNER JOIN groupData ON status.groupId = groupData.id ORDER BY groupData.id;');
                        $stmt->execute();

                        while ($row = $stmt->fetch()) {
                          $arr = str_split($row['status']);
                    ?>
                    <tr>
                      <th><?php echo nl2br($row['userName']); ?></th>
                      <th>グループ<?php echo nl2br($row['groupId']); ?></th>
                      <td><?php if($arr[0] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[1] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[2] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[3] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[4] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[5] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[6] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[7] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[8] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[9] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[10] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[11] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
                      <td><?php if($arr[12] == '1'){echo '済';}else{echo '<font color="red">未登録</font>';} ?></td>
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
    <script src="https://tkg-lab.tk/chatbot/page/lesson/2020c/js/bulma-accordion.js"></script>

  </body>
