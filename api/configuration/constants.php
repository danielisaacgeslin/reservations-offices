<?php

/* DIRECTORIES */
define("ROOT", $_SERVER["DOCUMENT_ROOT"] . "/reservations-offices/api/");
define("ROOT_URL", "https://" . $_SERVER["SERVER_NAME"] . "/reservations-offices/api/");

/* DATABASE */
define("DATA_BASE", "RESERVATIONS_OFFICES");
define("HOST", "localhost");
define("DB_USER", "root");
define("DB_PASSWORD", "");

/* RESPONSES */
define("OK", "OK");
define("ERROR", "ERROR");
define("INVALID_ROUTE", "route is missing or unrecognized");
define("SESSION_ACTIVE", "session is already active");
define("INVALID_LOGIN", "incorrect user or password");
define("INVALID_PRIVILEGES", "insufficient privileges");
?>
