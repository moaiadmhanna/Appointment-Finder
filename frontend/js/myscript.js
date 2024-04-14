$(document).ready(function () {
  getAllApointments();
});

function getAllApointments() {
  $.ajax({
    type: "GET",
    url: "../backend/serviceHandler.php",
    cache: false,
    data: {method: "getAllApointments"},
    dataType: 'json',
    success: function (response) {
      console.log(response);
      let appointmentList = $('#appointment_list');
      for (let i = 0; i < response.length; i++) {
        let appointmetli = $('<div></div>');
        appointmetli.addClass('card bg-dark text-white m-3');
        appointmetli.css({"width" : "20vw"})
        let image = $('<img src="photos/Appointments.jpg" class="card-image "></img>');
        appointmetli.append(image);
        let appointmentDiv = $('<div class="card-img-overlay"></div>');
        let title = $('<p>' + response[i].Title + '</p>');
        let location = $('<p>' + response[i].Location + '</p>');
        let date = $('<p> Date: ' + response[i].Date + '</p>');
        let expireDate = $(
          '<p> Expire Date: ' + response[i].Expiry_Date + '</p>',
        );
        appointmentDiv.append(title);
        appointmentDiv.append(location);
        appointmentDiv.append(date);
        appointmentDiv.append(expireDate);
        appointmetli.append(appointmentDiv);
        appointmentList.append(appointmetli);
      }
    },
  });
}