<?php
session_start();

require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["NAME"]) && !isset($_SESSION["ID"])) {
    header("Location: https://takagi-lab.tk/chatbot/page/Logout.php");
    exit;
}

// 管理者以外を弾く
$name = $_SESSION['NAME'];
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

?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
      <title>情報基礎数学botのページ</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <link rel="stylesheet" href="../css/botui.min.css" />
      <link rel="stylesheet" href="../css/botui-theme-test.css" />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

      <link rel="stylesheet" href="https://takagi-lab.tk/chatbot/page/css/style.css" />

      <!-- UIkit CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />

      <!-- UIkit JS -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>
  </head>
  <body class="background">

    <section class="uk-section uk-dark uk-background-cover">

      <div class="title">
        <p><?php echo($_SESSION["NAME"]); ?> でログイン中</p>
      </div>


      <!-- メイン表示部分 -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container">
          <div class="uk-card uk-card-default uk-card-body">
            <h3>チャットログ閲覧ページ（β）</h3>
            <div>
              <h4>第１２回チャットログ表示中</h4>
              <p>TAは自分のグループのチャットログを見て，補足説明してほしい学生がいたら対応してみてください．</p>
              <p>理解度は，０（デフォルト値：問題なし），１（全く分からない），２（少し分からない），３（少し分かる），４（結構分かる）となってます．</p>
              <p>特に理解度が１と２になっている学生のログを見て声をかけてみてください．</p>
              <table border="1">
                <tr>
                  <!-- <th>id</th> -->
                  <th width="5%">実施回</th>
                  <th width="5%">ユーザー名</th>
                  <th width="5%">グループ</th>
                  <th width="5%">理解度</th>
                  <th width="40%">ボットログ</th>
                  <th width="35%">ユーザーログ</th>
                  <!-- <th>全ログ</th> -->
                  <th width="5%">タイムスタンプ</th>
                </tr>
              <?php
              $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
              try{
                $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

                $stmt = $pdo->query('SELECT * FROM chatLog INNER JOIN groupData ON chatLog.name = groupData.userName ORDER BY groupId ASC');

                while ($row = $stmt->fetch()) {
                  if($row['lesson'] == 12){
                    echo '<tr>';
                    // echo '<th>';
                    // echo $row['id'];
                    // echo '</th>';
                    echo '<th>';
                    echo $row['lesson'] . '回';
                    echo '</th>';
                    echo '<th>';
                    echo $row['name'];
                    echo '</th>';
                    echo '<th>';
                    echo $row['groupId'];
                    echo '</th>';
                    echo '<th>';
                    echo $row['level'];
                    echo '</th>';
                    echo '<th>';
                    echo nl2br($row['logBot']);
                    echo '</th>';
                    echo '<th>';
                    echo nl2br($row['logHuman']);
                    echo '</th>';
                    // echo '<th>';
                    // echo $row['logAll'];
                    // echo '</th>';
                    echo '<th>';
                    echo $row['timestamp'];
                    echo '</th>';
                    echo '</tr>';
                  }
                }

              }catch(PDOException $e){
                $errorMessage = 'エラーです';
              }
              ?>
              </table>
            </div>
            <div>
              <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom" onclick="location.href='../'">戻る</button>
            </div>
          </div>
        </div>
      </section>

    </section>

    <!-- <script src="https://cdn.jsdelivr.net/vue/latest/vue.min.js"></script>
    <script src="../js/botui.min.js"></script>
    <script src="../js/bot_dev.js"></script> -->

  </body>
</html>
