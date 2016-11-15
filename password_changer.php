<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <style>
      * {
        box-sizing: border-box;
      }
      form {
        padding: 35px;
      }
      input, button {
        width:100%;
        padding:5px;
        display:block;
        margin-top: 15px;
      }
    </style>
  </head>
  <body>
    <form action="change.php" method="post">
      <h2>Change your password</h2>
      <input type="text" name="username" placeholder="username" />
      <input type="password" name="old_password" placeholder="old password" />
      <input type="password" name="new_password" placeholder="new password" />
      <button type="submit">change</button>
    </form>
  </body>
</html>
