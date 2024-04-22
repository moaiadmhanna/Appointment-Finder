<?php
// Bindet die DataHandler-Klasse ein, die für Datenbankoperationen zuständig ist
include("db/dataHandler.php");
// Definiert die Klasse SimpleLogic
class SimpleLogic
{
    private $dh; // Private Variable, die eine Instanz von DataHandler speichert

    function __construct() // Konstruktor der Klasse, der eine neue Instanz von DataHandler erstellt
    {
        $this->dh = new DataHandler();
    }

    // Funktion, die Anfragen basierend auf der Methode und den Parametern verarbeitet
    function handleRequest($method, $param)
    {
        switch ($method) {
            // Ruft Termine ab, gefiltert durch einen Parameter
            case "getApointments":
                $res = $this->dh->getApointments($param);
                break;
            // Dekodiert JSON-Parameter in ein Array und fügt einen neuen Termin hinzu
            case "addAppointment":
                $data = json_decode($param, true);
                $res = $this->dh->addAppointment($data['title'], $data['location'], $data['startDateTime'], $data['endDateTime'], $data['description'] ?? '');
                break;
            // Ruft spezifische Informationen zu einem Termin ab
            case "getAppointmentInformation":
                $res = $this->dh->getAppointmentInformation($param);
                break;
            // Dekodiert JSON-Parameter und speichert Informationen zu einem Termin
            case "saveAppointment":
                $data = json_decode($param, true);
                $res = $this->dh->saveAppointment($data['Name'],$data['Email'],$data['TimeStamp'],$data['Comment']);
                break;
            // Löscht einen Termin basierend auf einem übergebenen Parameter
            case "deleteAppointment":
                $res = $this->dh->deleteAppointment($param);
            // Setzt das Ergebnis auf null, wenn keine gültige Methode angegeben ist
            default:
                $res = null;
                break;
        }
        // Gibt das Ergebnis der Anfrage zurück
        return $res;
    }
}
