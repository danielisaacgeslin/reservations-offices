<?php

class Reservation {

    public function reservationValidity($day, $month, $year, $from, $to, $space, $id){
        $now = (int) (date('Y').date('m').date('d'));
        $date = (int) ($year.$month.$day);

        if($date < $now or $to < $from or $to === $from){
            return false;
        }

        $rule_one = '(FROM_TIME > :from_time AND TO_TIME > :to_time AND FROM_TIME < :to_time)';
        $rule_two = '(FROM_TIME < :from_time AND TO_TIME < :to_time AND TO_TIME > :from_time)';
        $rule_three = '(FROM_TIME >= :from_time AND TO_TIME <= :to_time)';
        $rule_four = '(FROM_TIME <= :from_time AND TO_TIME >= :to_time)';

        $link = Connection::connect();
        $query = 'SELECT ID FROM RESERVATIONS WHERE SPACE = :space AND '
                . 'DAY(DATE) = :day AND MONTH(DATE) = :month AND YEAR(DATE) = :year '
                . 'AND (' . $rule_one . ' OR ' . $rule_two . ' OR ' . $rule_three . ' OR '. $rule_four . ')';
        $stmt = $link->prepare($query);

        $stmt->bindParam(':day', $day, PDO::PARAM_INT);
        $stmt->bindParam(':month', $month, PDO::PARAM_INT);
        $stmt->bindParam(':year', $year, PDO::PARAM_INT);
        $stmt->bindParam(':from_time', $from, PDO::PARAM_INT);
        $stmt->bindParam(':to_time', $to, PDO::PARAM_INT);
        $stmt->bindParam(':space', $space, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if($result and $result['ID'] != $id){
            return false;
        }else{
            return true;
        }
    }

    public function setReservation($title, $date, $from, $to, $space, $description) {
        $creation_user = $_SESSION["ID"];
        if (!isset($title) or ! isset($date) or ! isset($from) or !isset($to) or !isset($space)) {
            return false;
        }

        $link = Connection::connect();
        $query = 'INSERT INTO RESERVATIONS '
                . '(TITLE, DATE, FROM_TIME, TO_TIME, SPACE, CREATION_USER, DESCRIPTION) '
                . 'VALUES (:title, :date, :from_time, :to_time, :space, :creation_user, :description)';
        $stmt = $link->prepare($query);

        $stmt->bindParam(':title', $title, PDO::PARAM_STR);
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->bindParam(':from_time', $from, PDO::PARAM_INT);
        $stmt->bindParam(':to_time', $to, PDO::PARAM_INT);
        $stmt->bindParam(':space', $space, PDO::PARAM_INT);
        $stmt->bindParam(':creation_user', $creation_user, PDO::PARAM_INT);
        $stmt->bindParam(':description', $description, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $link->lastInsertId();
        } else {
            return false;
        }
    }

    public function updateReservation($reservation_id, $title, $date, $from, $to, $space, $description) {
      var_dump($space);
        $user = $_SESSION["ID"];
        if (!isset($reservation_id) or ! isset($title) or ! isset($date) or ! isset($from) or !isset($to) or !isset($space)) {
            return false;
        }

        $link = Connection::connect();
        $query = 'UPDATE RESERVATIONS SET '
                . 'TITLE = :title, DATE = :date, FROM_TIME = :from_time, TO_TIME = :to_time, DESCRIPTION = :description, '
                . 'EDITION_USER = :edition_user, EDITION_TIMESTAMP = CURRENT_TIMESTAMP, SPACE = :space '
                . 'WHERE ID = :reservation_id AND CREATION_USER = :user';
        $stmt = $link->prepare($query);

        $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
        $stmt->bindParam(':title', $title, PDO::PARAM_STR);
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->bindParam(':from_time', $from, PDO::PARAM_INT);
        $stmt->bindParam(':to_time', $to, PDO::PARAM_INT);
        $stmt->bindParam(':space', $space, PDO::PARAM_INT);
        $stmt->bindParam(':edition_user', $user, PDO::PARAM_INT);
        $stmt->bindParam(':user', $user, PDO::PARAM_INT);
        $stmt->bindParam(':description', $description, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $stmt->rowCount();
        } else {
            return false;
        }
    }

    public function getReservation($id) {
        $link = Connection::connect();

        $query = 'SELECT A.*, B.FLOOR, B.DEPARTMENT, B.FIRST_NAME, B.LAST_NAME, C.TEXT AS "SPACE_TEXT" FROM RESERVATIONS AS A '
                . 'INNER JOIN USERS AS B ON A.CREATION_USER = B.ID '
                . 'INNER JOIN SPACES AS C ON A.SPACE = C.ID '
                . 'WHERE A.ID = :id';

        $stmt = $link->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteReservation($id) {
        $link = Connection::connect();
        $user = $_SESSION["ID"];
        /* deleting comments */
        $query = 'DELETE FROM COMMENTS WHERE RESERVATION_ID = :id';

        $stmt = $link->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        $stmt->execute();

        /* deleting tag list */
        $query = 'DELETE FROM TAG_LISTS WHERE RESERVATION_ID = :id AND CREATION_USER = :user';

        $stmt = $link->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':user', $user, PDO::PARAM_INT);

        $stmt->execute();

        /* deleting reservation */
        $query = 'DELETE FROM RESERVATIONS WHERE ID = :id AND CREATION_USER = :user';

        $stmt = $link->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':user', $user, PDO::PARAM_INT);

        $stmt->execute();

        $result = $stmt->rowCount();

        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    public function addTag($reservation_id, $tag_id) {
        $link = Connection::connect();
        $user = $_SESSION["ID"];
        $query = 'INSERT INTO TAG_LISTS (RESERVATION_ID, TAG_ID, CREATION_USER) VALUES (:reservation_id, :tag_id, :creation_user)';

        $stmt = $link->prepare($query);

        $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
        $stmt->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
        $stmt->bindParam(':creation_user', $user, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function removeTag($reservation_id, $tag_id) {
        $link = Connection::connect();

        $query = 'DELETE FROM TAG_LISTS WHERE RESERVATION_ID = :reservation_id AND TAG_ID = :tag_id AND CREATION_USER = :user';

        $stmt = $link->prepare($query);

        $stmt->bindParam(':reservation_id', $reservation_id, PDO::PARAM_INT);
        $stmt->bindParam(':tag_id', $tag_id, PDO::PARAM_INT);
        $stmt->bindParam(':user', $_SESSION["ID"], PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function __construct() {

    }

}

?>
