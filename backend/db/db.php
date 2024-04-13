<?php
    $servername = "localhost";
    $username = "bif2webscriptinguser";
    $password = "bif2023";
    $dbname = "Appointments_Finder";
    // Verbindung erstellen
    $db = new mysqli($servername,$username,$password,$dbname);
    // Verbindungsfehlermeldung
    if($db->connect_error){
        echo "Error connecting to $dbname: " .  $db->connect_error;
        exit(1);
    }
?>
