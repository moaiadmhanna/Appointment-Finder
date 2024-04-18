<?php
include("./models/appointment.php");
require_once ("db.php");
class DataHandler
{
    

    public static function getApointments($param = null)
    {
        global $db;
        $resultArray = array();
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
}
