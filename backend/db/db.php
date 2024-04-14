<?php
require_once 'cred.php';

try {
    $db = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);
    if ($db->connect_error) {
        exit(1);
    }
    define('db', $db);
} catch (Exception $e) {
    echo "Website is currently not available!";
    exit;
}
?>