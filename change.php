<?php
  require('./api/configuration/constants.php');
  require('./api/configuration/autoloader.php');

  $user = new User();
  
  if($user -> changePassword($_POST['username'], $_POST['old_password'], $_POST['new_password'])){
    echo 'password cambiado exitosamente';
  }else{
    echo 'error al cambiar el password';
  }
?>
