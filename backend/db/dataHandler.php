<?php
include("./models/appointment.php");
class DataHandler
{
    

    public static function getDemoData()
    {
        $demodata = [
            new Appoitment("Webscript", "Wien", "March 23 17:00", "March 23 17:15"),
            new Appoitment("Mathe", "Wien", "March 23 17:15", "March 23 17:30"),
            new Appoitment("Deutsch", "München", "March 23 17:30", "March 23 17:45"),
            new Appoitment("English", "Düsseldorf", "March 23 17:45", "March 23 18:00"),
        ];
        return $demodata;
    }
}
