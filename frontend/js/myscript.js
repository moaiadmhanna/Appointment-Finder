$(document).ready(function() {
    printData();
});

function printData() {
   $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        dataType: "json",
        success: function (response) {
            let appointmentList = $("#appointment_list");
            for(let i = 0; i < response.length; i++) {
                let appointmetli = $("<li></li>");
                appointmetli.addClass("list-group-item"); 
                let appointmentDiv = $("<div></div>");
                let title = $("<p>" + response[i].title + "</p>");
                let location = $("<p>" + response[i].location + "</p>");
                let date = $("<p> Date: " + response[i].date + "</p>");
                let expireDate = $("<p> Expire Date: " + response[i].expireDate + "</p>");
                appointmentDiv.append(title);
                appointmentDiv.append(location);
                appointmentDiv.append(date);
                appointmentDiv.append(expireDate);
                appointmetli.append(appointmentDiv);
                appointmentList.append(appointmetli);
            }
        }
   });
}
