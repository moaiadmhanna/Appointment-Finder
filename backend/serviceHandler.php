<?php
    // Fehlermeldung aktivieren, um alle Fehler anzuzeigen
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
    include ("businesslogic/simpleLogic.php");
    // Initialisierung von Variablen für die Methode und Parameter
    $method = "";
    $param = "";
    
    // Überprüfen des Request-Typs (GET oder POST) und Einlesen der entsprechenden Parameter
    if($_SERVER["REQUEST_METHOD"] == "GET"){
        // Zuweisen der 'method' und 'param' aus der GET-Anfrage, wenn vorhanden
        isset($_GET["method"]) ? $method = $_GET["method"] : false;
        isset($_GET["param"]) ? $param = $_GET["param"] : false;
    }
    else{
        // Zuweisen der 'method' und 'param' aus der POST-Anfrage, wenn vorhanden
        isset($_POST["method"]) ? $method = $_POST["method"] : false;
        isset($_POST["param"]) ? $param = $_POST["param"] : false;
    }
    // Erstellen eines Objekts der Geschäftslogikklasse
    $logic = new SimpleLogic();
    // Aufrufen der 'handleRequest'-Methode des Logikobjekts mit Methode und Parameter
    $result = $logic->handleRequest($method, $param);
    // Überprüfen des Ergebnisses und Senden der entsprechenden HTTP-Antwort
    if ($result == null) {
        // Antwortfunktion aufrufen mit Status 400, wenn kein Ergebnis vorhanden ist
        response("GET", 400, null);
    } else {
        // Antwortfunktion aufrufen mit Status 200 und den resultierenden Daten
        response("GET", 200, $result);
    }
    // Funktion, die eine HTTP-Antwort im JSON-Format sendet
    function response($method, $httpStatus, $data)
    {
        header('Content-Type: application/json');
        switch ($method) {
            case "GET":
                // JSON-Formatierung des Datenarrays und Ausgabe
                echo (json_encode($data));
                break;
            default:
                // HTTP-Statuscode für nicht unterstützte Methoden setzen
                http_response_code(405);
                echo ("Method not supported yet!");
        }
    }
?>
