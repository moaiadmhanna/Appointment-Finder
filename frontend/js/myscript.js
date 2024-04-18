$(document).ready(function () {
  getApointments();
  
  $("#search_form").on("submit", function(event) {
    event.preventDefault();
    submitForm();
  });
});

$("#search_btn").on("click", function () {
  submitForm();
});

function submitForm() {
  let input = $("#search_input").val();
  getApointments(input);
}
function dateInSQLFormat(type = "without"){
  let todaysDate = new Date();
  // Format the date to be in SQL format
  let year = todaysDate.getFullYear();
  let month = todaysDate.getMonth() + 1;
  if (month < 10) { month = '0' + month;}
  let day = todaysDate.getDate();
  if (day < 10) { day = '0' + day;}
  let hour = todaysDate.getHours();
  let minute = todaysDate.getMinutes();
  if(type == "without"){
    var result  = `${year}-${month}-${day}`;
  }
  else{
    var result = `${year}-${month}-${day} ${hour}:${minute}`;
  }
  return result;
}
function getAppointmentInformation(appID){
  return $.ajax({
    type: "GET",
    url: "../backend/serviceHandler.php",
    cache: false,
    data: {method: "getAppointmentInformation",param : appID},
    dataType: 'json'
  })
}
function createAppointment(response){
  let appointmentList = $('#appointment_list');
  appointmentList.empty();
  for (let i = 0; i < response.length; i++) {
    let cardDiv = $('<div class="d-flex flex-column align-items-center"></div>')
    let appointmetli = $('<div class="card text-center text-white bg-dark m-3 p-3 rounded" style="min-width:16rem;"></div>');
    let appointmentDiv = $('<div class="card-body"></div>');
    let title = $('<h5 class="card-title">' + response[i].Title + '</h5>');
    let location = $('<p class="card-text">' + response[i].Location + '</p>');
    let date = $('<p class="card-text">Date:</p> <p class="card-text">' + response[i].Date + '</p>');
    let expireDate = $(
      '<p class="card-text">Expire Date:</p> <p class="card-text">' + response[i].Expiry_Date + '</p>',
    );
    let footerDiv = $('<div class="d-flex justify-content-center"></div>');
    let dateDiff = new Date().getDate() - new Date(response[i].Create_Date).getDate();
    if(dateDiff == 0){
      var dateCreated = $(`<div class="card-footer text-dark bg-light rounded">Today</div>`)
    }
    else {
      var dateCreated = $(`<div class="card-footer text-dark bg-light rounded">${dateDiff} day ago </div>`);
    }
    let collapseBtn = $(`<button class="btn btn-outline-info btn-sm ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample${i}" aria-expanded="false" aria-controls="offcanvasExample${i}">More Info</button>`);
    footerDiv.append(dateCreated,collapseBtn);
    let collapseDiv = $(`
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample${i}" aria-labelledby="offcanvasExample${i}">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Description</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
    </div>`);
    if(response[i].Voting == "1"){
      getAppointmentInformation(response[i].Appointment_id).success(function(infoResponse){
        var collapseBody = $(`
      <div class="offcanvas-body">
        <p>${response[i].Description}</p>
        <h5 style="text-align:start;">Comment</h5>
        <p>${infoResponse[0].comment}</p>
        <h5 style="text-align:start;">User Name</h5>
        <p>${infoResponse[0].Name}</p>
        <h5 style="text-align:start;">Email</h5>
        <p>${infoResponse[0].Email}</p>
      </div>`);
      collapseDiv.append(collapseBody);
      })
    }
    else{
      var collapseBody = $(`
      <div class="offcanvas-body">
        <p>${response[i].Description}</p>
      </div>`);
      collapseDiv.append(collapseBody);
    }
    appointmentDiv.append(title,location,date,expireDate,footerDiv,collapseDiv);
    appointmetli.append(appointmentDiv);
    let checkBox = $('<input class="form-check-input-dark" type="checkbox" value=""></input>');
    if(response[i].Voting == "1"){
      checkBox.attr("disabled",true);
      appointmetli.css({
        "background": "repeating-linear-gradient(45deg,grey,grey 10px,green 10px,green 20px)"
      })
    }
    if(response[i].Date < dateInSQLFormat("with") && response[i].Voting == "0") {
      checkBox.attr("disabled",true);
      appointmetli.css({
        "background": "repeating-linear-gradient(45deg,grey,grey 10px,black 10px,black 20px)"
      })
    }
    cardDiv.append(appointmetli);
    cardDiv.append(checkBox);
    if(response[i].Voting == "0" && response[i].Date >= dateInSQLFormat("with")){
      appointmentList.prepend(cardDiv);
    }
    else{
      appointmentList.append(cardDiv);
    }
  }
}
function getApointments(param = null) {
  $.ajax({
    type: "GET",
    url: "../backend/serviceHandler.php",
    cache: false,
    data: {method: "getApointments",param : param},
    dataType: 'json',
    success: function (response) {
      if(response == null){
        let appointmentList = $('#appointment_list');
        appointmentList.empty();
        appointmentList.css({"width":"auto"});
        appointmentList.append("<div class='text-danger w-100' style='text-align:center;'>Nothing Found </div>");
      }
      else{
        createAppointment(response);
      }
    },
  });
}
function addAppointment(title, location, startDateTime, endDateTime, description) {
  $.ajax({
    type: 'POST',
    url: '../backend/serviceHandler.php',
    data: {
      method: 'addAppointment',
      param: JSON.stringify({
        title: title,
        location: location,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        description: description,
      }),
    },
    success: function (response) {
      getApointments();
      $('#newAppointmentModal').modal('hide');
    },
  });
}
$('#new_appointment_form').on('submit', function (event) {
  event.preventDefault();
  let title = $('#appointmentTitle').val();
  let location = $('#appointmentLocation').val();
  let date = $('#appointmentDate').val();
  let expireDate = $('#appointmentExpireDate').val();
  let Description = $('#appointmentDescription').val();
  let startTime = $('#appointmentStartTime').val();
  let endTime = $('#appointmentEndTime').val();

  let startDateTime = date + ' ' + startTime;
  console.log(startDateTime);
  let endDateTime = expireDate + ' ' + endTime;

  addAppointment(title, location, startDateTime, endDateTime, Description);
});