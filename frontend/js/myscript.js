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
function getAppointment(response){
  console.log(response);
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
    let dateDiff = new Date().getDate() - new Date(response[i].Create_Date).getDate();
    if(dateDiff == 0){
      var dateCreated = $(`<div class="card-footer text-dark bg-light">Today</div>`)
    }
    else {
      var dateCreated = $(`<div class="card-footer text-dark bg-light">${dateDiff} day ago </div>`);
    }
    appointmentDiv.append(title,location,date,expireDate,dateCreated);
    appointmetli.append(appointmentDiv);
    let checkBox = $('<input class="form-check-input-dark" type="checkbox" value=""></input>');
    if(response[i].Voting == "1"){
      checkBox.attr("disabled",true);
      checkBox.attr("checked",true);
      appointmetli.css({
        "background": "repeating-linear-gradient(45deg,grey,grey 10px,green 10px,green 20px)"
      })
    }
    if(response[i].Date < dateInSQLFormat() && response[i].Voting == "0") {
      checkBox.attr("disabled",true);
      appointmetli.css({
        "background": "repeating-linear-gradient(45deg,grey,grey 10px,black 10px,black 20px)"
      })
    }
    cardDiv.append(appointmetli);
    cardDiv.append(checkBox);
    if(response[i].Voting == "0" && response[i].Date >= dateInSQLFormat()){
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
        getAppointment(response);
      }
    },
  });
}