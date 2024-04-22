<?php
// Importiert die Datei 'cred.php', die die Zugangsdaten und Umgebungsvariablen für die Datenbank enthält
require_once 'cred.php';

try {
    // Erstellt ein neues mysqli-Objekt mit den Datenbankzugangsdaten
    $db = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);
    // Überprüft, ob ein Verbindungsfehler aufgetreten ist
    if ($db->connect_error) {
        // Beendet das Skript mit einem Fehlerstatus, wenn die Verbindung fehlschlägt
        exit(1);
    }
    // Definiert eine Konstante 'db', die das Datenbankverbindungsobjekt speichert
    define('db', $db);
} catch (Exception $e) {
    // Gibt eine Fehlermeldung aus und beendet das Skript
    echo "Website is currently not available!";
    exit;
}
?>