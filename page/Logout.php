<?php
session_start();

if (isset($_SESSION["NAME"])) {
    $errorMessage = "ログアウトしました。３秒後にログインページにジャンプします。";
} else {
    $errorMessage = "セッションがタイムアウトしました。３秒後にログインページにジャンプします。";
}

// セッションの変数のクリア
$_SESSION = array();

// セッションクリア
@session_destroy();
?>

<!doctype html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>ログアウト</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body onload=setTimeout("location.href='Login.php'",3000)>
        <h1>ログアウト画面</h1>
        <div><?php echo htmlspecialchars($errorMessage, ENT_QUOTES); ?></div>
        <a href="Login.php">(自動的にページが移らない場合)ログイン画面に戻る</a>
    </body>
</html>
