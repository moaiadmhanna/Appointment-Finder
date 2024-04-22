<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "getApointments":
                $res = $this->dh->getApointments($param);
                break;
            case "addAppointment":
                $data = json_decode($param, true);
                $res = $this->dh->addAppointment($data['title'], $data['location'], $data['startDateTime'], $data['endDateTime'], $data['description'] ?? '');
                break;
            case "getAppointmentInformation":
                $res = $this->dh->getAppointmentInformation($param);
                break;
            case "saveAppointment":
                $data = json_decode($param, true);
                $res = $this->dh->saveAppointment($data['Name'],$data['Email'],$data['TimeStamp'],$data['Comment']);
                break;
            case "deleteAppointment":
                $res = $this->dh->deleteAppointment($param);

            default:
                $res = null;
                break;
        }
        return $res;
    }
}
