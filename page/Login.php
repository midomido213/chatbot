<?php
// require 'password.php';   // password_verfy()はphp 5.5.0以降の関数のため、バージョンが古くて使えない場合に使用
// セッション開始
session_start();

require_once '../config/config.php';

// エラーメッセージの初期化
$errorMessage = "";

// ログインボタンが押された場合
if (isset($_POST["login"])) {
    // 1. ユーザIDの入力チェック
    if (empty($_POST["userid"])) {  // emptyは値が空のとき
        $errorMessage = 'ユーザーIDが未入力です。';
    } else if (empty($_POST["password"])) {
        $errorMessage = 'パスワードが未入力です。';
    }

    if (!empty($_POST["userid"]) && !empty($_POST["password"])) {
        // 入力したユーザIDを格納
        $userid = $_POST["userid"];

        // 2. ユーザIDとパスワードが入力されていたら認証する
        $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);

        // 3. エラー処理
        try {
            $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

            $stmt = $pdo->prepare('SELECT * FROM userData WHERE name = ?');
            $stmt->execute(array($userid));

            $password = $_POST["password"];

            if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if (password_verify($password, $row['password'])) {
                    session_regenerate_id(true);

                    // 入力したIDのユーザー名を取得
                    $id = $row['id'];

                    $_SESSION["ID"] = $id;

                    $sql = "SELECT * FROM userData WHERE id = $id";  //入力したIDからユーザー名を取得
                    $stmt = $pdo->query($sql);
                    foreach ($stmt as $row) {
                        $row['name'];  // ユーザー名
                    }
                    $_SESSION["userId"] = $row['name'];

                    if($row['admin'] == 1){
                      header("Location: https://tkg-lab.tk/chatbot/admin/");
                    }else{
                      header("Location: https://tkg-lab.tk/g031o008/plan/view/main/");  // メイン画面へ遷移
                    }
                    exit();  // 処理終了
                } else {
                    // 認証失敗
                    $errorMessage = 'ユーザーIDあるいはパスワードに誤りがあります。';
                }
            } else {
                // 4. 認証成功なら、セッションIDを新規に発行する
                // 該当データなし
                $errorMessage = 'ユーザーIDあるいはパスワードに誤りがあります。';
            }
        } catch (PDOException $e) {
            $errorMessage = 'データベースエラー';
            //$errorMessage = $sql;
            // $e->getMessage() でエラー内容を参照可能（デバッグ時のみ表示）
            // echo $e->getMessage();
        }
    }
}
?>

<!doctype html>
<html>
    <head>
      <meta charset="UTF-8">
      <title>ログイン</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="css/form.css" />
    </head>
    <body>
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

      <form id="loginForm" name="loginForm" action="" method="POST">
        <div class="form-wrapper">
          <h1>情報基礎数学<br />学習計画・振り返りシステム<br/>ログイン</h1>
          <p>※共通基盤教育システムの初期ID，PWで設定しています．</P>
          <font color="#FF0000"><?php echo $errorMessage ?></font>
          <form>
            <div class="form-item">
              <label for="userid"></label>
              <input type="text" id="userid" name="userid" placeholder="ユーザーIDを入力" value="<?php if (!empty($_POST["userid"])) {echo htmlspecialchars($_POST["userid"], ENT_QUOTES);} ?>">
            </div>
            <div class="form-item">
              <label for="password"></label>
              <input type="password" id="password" name="password" value="" placeholder="パスワードを入力">
            </div>
            <div class="button-panel">
              <input type="submit" id="login" name="login" class="button" value="ログイン">
            </div>
          </form>
          <div class="form-footer">
            問い合わせ：g231r010@s.iwate-pu.ac.jp
          </div>
        </div>
      </form>
    </body>
</html>
