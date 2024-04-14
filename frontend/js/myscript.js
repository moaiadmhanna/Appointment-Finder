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
        let cardDiv = $('<div class="d-flex flex-column align-items-center"style="min-width:15rem;"></div>')
        let appointmetli = $('<div class="card text-white bg-dark m-3"></div>');
        let appointmentDiv = $('<div class="card-body"></div>');
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
        cardDiv.append(appointmetli);
        let checkBox = $('<div class="form-check p-0"><input class="form-check-input-dark" type="checkbox" value="" id="flexCheckDefault"></input> </div>');
        cardDiv.append(checkBox);
        appointmentList.append(cardDiv);
      }
    },
  });
}