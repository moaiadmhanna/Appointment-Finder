<?php
include("./models/appointment.php");
require_once ("db.php");
class DataHandler
{
    

    public static function getAllApointments()
    {
        global $db;
        $resultArray = array();
        $sql = "SELECT * FROM Appointments";
        $result=$db->query($sql);
        while($row = $result->fetch_assoc()){
            array_push($resultArray,$row);
        }
        return $resultArray;
    }
}
