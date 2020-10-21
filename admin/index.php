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
            <p><strong>このシステムの利用方法について</strong></p>
            <p>チャットログ閲覧ページを確認し、分からない箇所について記述している学生については内容について指導してください。</p>
            <p>理解度に応じてチャットログの色が変わっています。参考にしてください。</p>
            <p>システム操作マニュアルについて準備中です。後日掲載する予定です。</p>
          </div>
        </article>
        <!-- <article class="box media">
          <div class="media-content">
            <span class="icon has-text-danger"><i class="fas fa-exclamation-triangle"></i></span>
            <p>未対応の学生がいます。</p>
            <p>チャットログ確認ページにアクセスして個別対応をしてください。</p>
            <p>対応内容はチャットログ確認ページから入力できます。</p>
          </div>
        </article> -->
        <article class="box media">
          <div class="media-content">
            <p><strong>管理者限定表示</strong></p>
            <ul class="menu-list">
                <li><a href="./status/">振り返り状況確認ページ</a></li>
                <li><a href="./log/">チャットログ閲覧ページ</a></li>
                <li><a href="./post/">システムへの意見等送信フォーム</a></li>
                <!-- <li><a href="#">ユーザー管理（準備中）</a></li> -->
             </ul>
          </div>
        </article>
        <article class="box media">
           <div class="media-content">
              <div class="content">
                 <p><strong>チャットボットページ確認用（２０２０年度Ｂ）</strong></p>
                 <p>各回の動作確認用です。</p>
                 <ul class="menu-list">
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/2.php">第2回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/3.php">第3回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/4.php">第4回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/5.php">第5回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/6.php">第6回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/7.php">第7回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/8.php">第8回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/9.php">第9回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/10.php">第10回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/11.php">第11回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/12.php">第12回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/13.php">第13回</a></p></li>
                   <li><p><a href="https://tkg-lab.tk/chatbot/page/lesson/2020b/bot/14.php">第14回</a></p></li>
                 </ul>
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

  </body>
</html>
