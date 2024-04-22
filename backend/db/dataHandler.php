<?php
// Bindet die Datenbankverbindungsdatei ein
require_once ("db.php");
// Definiert eine Klasse von Datenbankoperationen bezüglich Terminen
class DataHandler
{
    
    // Methode, um Termine abzurufen; optional gefiltert durch einen Parameter
    public static function getApointments($param = null)
    {
        global $db; // Verwendet die globale Datenbankverbindung
        $resultArray = array(); // Initialisiert ein leeres Array für die Ergebnisse
        if($param == null)
        {
            $sql = "SELECT * FROM Appointments
            ORDER BY Voting , Date desc";
            $result=$db->query($sql);
            while($row = $result->fetch_assoc()){
                array_push($resultArray,$row);
            }
            return $resultArray;
        }
        // Wenn ein Parameter vorhanden ist, führe eine gefilterte Suche aus
        $sql = "SELECT * FROM Appointments WHERE Title LIKE CONCAT('%', ?, '%') ORDER BY Voting , Date desc";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("s",$param);
        $stmt->execute();
        $result = $stmt->get_result();
        while($row = $result->fetch_assoc()){
            array_push($resultArray,$row);
        }
        return $resultArray;
    }
    // Methode zur Abfrage von spezifischen Termininformationen
    public static function getAppointmentInformation($param){
        global $db;
        $resultArray = array();
        $sql = "SELECT comment,Name,Email FROM scheduled_appointments join users using(User_Id) WHERE Appointment_fk = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("s",$param);
        $stmt->execute();
        $result = $stmt->get_result();
        while($row = $result->fetch_assoc()){
            array_push($resultArray,$row);
        }
        return $resultArray;
    }
    // Methode zum Hinzufügen eines neuen Termins
    public function addAppointment($title, $location, $startDateTime, $endDateTime, $description)
    {
        global $db;
        $sql = "INSERT INTO Appointments (Title, Location, Date, Expiry_Date, Voting, Description) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $vote = 0;
        $stmt->bind_param("ssssis", $title, $location, $startDateTime, $endDateTime, $vote, $description);
        $stmt->execute();
        return $stmt->affected_rows;
    }
    // Methode zum Speichern eines Termins mit Benutzerdaten
    public function saveAppointment($Name,$Email,$TimeStamp,$Comment){
        global $db;
        if(empty(searchUser($Email))){
            createUser($Name,$Email);
        }
        $UserID = searchUser($Email)["User_Id"];
        $AppointmentId = getAppointmentId($TimeStamp);
        changeVoting($TimeStamp);
        $sql = "INSERT INTO scheduled_appointments(Comment,Appointment_fk,User_Id) VALUES(?,?,?)";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("sii",$Comment,$AppointmentId,$UserID);
        $stmt->execute();
        return $stmt->affected_rows;
    }
    // Methode zum Löschen eines Termins
    public static function deleteAppointment($TimeStamp)
    {
        global $db;
        $sql = "DELETE FROM Appointments WHERE Create_date = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("s", $TimeStamp);
        $stmt->execute();
        return $stmt->affected_rows;
    }
}
// Funktion zum Erstellen eines neuen Benutzers
function createUser($Name,$Email){
    global $db;
    $sql = "INSERT INTO users(Name,Email) VALUES(?,?)";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ss",$Name,$Email);
    $stmt->execute();
    return $stmt->affected_rows;
}
// Funktion zum Suchen eines Benutzers anhand der E-Mail
function searchUser($Email){
    global $db;
    $sql = "SELECT User_Id FROM users WHERE EMAIL = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s",$Email);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row;
}
// Funktion zum Abrufen der Termin-ID anhand des Erstellungsdatums
function getAppointmentId($TimeStamp){
    global $db;
    $sql = "SELECT Appointment_id FROM Appointments WHERE Create_Date = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s",$TimeStamp);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if($row == null){
        return null;
    }
    return $row["Appointment_id"];
}
// Funktion zum Aktualisieren des Abstimmungsstatus eines Termins
function changeVoting($TimeStamp){
    global $db;
    $sql = "UPDATE Appointments SET Voting = '1' WHERE Create_date = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s",$TimeStamp);
    $stmt->execute();
    $stmt->close();
}
