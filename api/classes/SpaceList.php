<?php

class SpaceList extends Space {

    public function getSpaces() {
        $link = Connection::connect();

        $query = 'SELECT * FROM SPACES';

        $stmt = $link->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function __construct() {

    }

}

?>
