<?php
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
    include ("db/dataHandler.php");

    function returnAllAppointments(){
        $data = new DataHandler();
        return $data->getDemoData();
    }

    $result = returnAllAppointments();
    
    header('Content-Type: application/json');
    if ($result == null) {
        http_response_code(400);
        echo json_encode(null);
    } else {
        http_response_code(200);
        echo json_encode($result);
    }
?>
