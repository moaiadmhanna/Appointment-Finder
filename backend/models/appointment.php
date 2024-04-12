<?php
    class Appoitment {
        public $id;
        public $title;
        public $location;
        public $date;
        public $expireDate;
        public $vote;

        function __construct($title,$location,$date,$expireDate){
            $randomNumber = rand(1000,9999);
            $this->id = $randomNumber;
            $this->title = $title;
            $this->location = $location;
            $this->date = $date;
            $this->expireDate = $expireDate;
            $this->vote = 0;
        }
    }
?>