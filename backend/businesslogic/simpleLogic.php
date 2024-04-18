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
                $res = $this->dh->addAppointment($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
