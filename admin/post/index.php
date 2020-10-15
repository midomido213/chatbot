<?php
session_start();

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
    header("Location: https://tkg-lab.tk//chatbot/page/Login.php");
    exit;
  }
}catch(PDOException $e){

}

// フォームデータ記録
$userName = $_POST['userName'];
$comment = $_POST['comment'];

if(isset($comment)){
  try{
    $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
    $stmt = $pdo->prepare('INSERT INTO postData (name, comment) VALUES (?, ?)');
    $stmt->execute(array($userName, $comment));

    $alert = '<div class="uk-alert-success" uk-alert><a class="uk-alert-close" uk-close></a><p>登録が完了しました。</p></div>';
  }catch(PDOException $e){
    $alert ='登録エラーです。やり直してください。';
  }
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
    <div class="hero is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">情報基礎数学 計画/振り返りシステム 管理画面</h1>
        </div>
      </div>
    </div>

    <!-- メイン表示部分 -->
    <main class="columns">
      <div class="submenu column is-3">
        <!-- side bar -->
        <aside class="box">
          <p>TA/SA/教員用管理ページです。</p>
          <p>通常の学生は、学習計画の作成ページに遷移します。</p>
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
            <p><?php echo $alert; ?></p>
            <p><strong>システムについての意見・不具合報告など・・・</strong></p>
            <p>操作方法が分からない部分，改善してほしい部分などありましたらフォームより投稿してください．</p>
            <p>投稿内容を確認してシステムの改善を行います．改善内容については随時報告します．</p>
          </div>
        </article>
        <article class="box media">
          <div class="media-content">
            <form action="index.php" method="post">
              <div class="field">
                <label class="label">フォーム</label>
                <input type="hidden" name="userName" value="<?php echo($_SESSION["userId"]); ?>" />
                <textarea class="textarea" name="comment" placeholder="記述・・・"></textarea>
              </div>
               <button class="button is-primary">送信</button>
            </form>
          </div>
        </article>
        <article class="box media">
          <div class="media-content">
            <p>または，以下までメールでお知らせください．</p>
            <p>g231r010@s.iwate-pu.ac.jp</p>
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

  </body>
</html>
