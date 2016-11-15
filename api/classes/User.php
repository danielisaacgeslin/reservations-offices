<?php

class User {

    public function validateSession(){
        if(isset($_SESSION['ID'])){
            return true;
        }else{
            return false;
        }
    }

    public function login($username, $password) {
        $password = md5($password);
        $link = Connection::connect();

        $query = 'SELECT ID, ROLE, USERNAME, EMAIL, FIRST_NAME, LAST_NAME, FLOOR, DEPARTMENT FROM USERS '
                . 'WHERE USERNAME = :username AND PASSWORD = :password';

        $stmt = $link->prepare($query);

        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);

        $stmt ->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if($result){
            foreach($result as $key => $value){
                $_SESSION[$key] = $value;
            }
        }
        return $result;
    }

    public function changePassword($username, $old_password, $new_password){
      $old_password = md5($old_password);
      $new_password = md5($new_password);

      $link = Connection::connect();

      $query = 'UPDATE USERS SET PASSWORD = :new_password '
              . 'WHERE USERNAME = :username AND PASSWORD = :old_password';

      $stmt = $link->prepare($query);

      $stmt->bindParam(':username', $username, PDO::PARAM_STR);
      $stmt->bindParam(':old_password', $old_password, PDO::PARAM_STR);
      $stmt->bindParam(':new_password', $new_password, PDO::PARAM_STR);

      $stmt ->execute();

      return $stmt -> rowCount();
    }

    public function logout(){
        session_unset();
        session_destroy();
        return true;
    }

    public function __construct() {
        session_start();
    }

}

?>
