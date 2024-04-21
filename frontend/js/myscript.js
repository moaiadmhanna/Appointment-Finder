
$(document).ready(function () {
  getApointments();
  setMin();
  $("#search_form").on("submit", function(event) {
    event.preventDefault();
    submitForm();
  });

  $('#new_appointment_form').on('submit', function (event) {
    let title = $('#appointmentTitle').val();
    let location = $('#appointmentLocation').val();
    let date = $('#appointmentDate').val();
    let expireDate = $('#appointmentExpireDate').val();
    let Description = $('#appointmentDescription').val();
    let startTime = $('#appointmentStartTime').val();
    let endTime = $('#appointmentEndTime').val();
  
    let startDateTime = date + ' ' + startTime;
    let endDateTime = expireDate + ' ' + endTime;
  
    addAppointment(title, location, startDateTime, endDateTime, Description);
  })
  $("#save_appointment_form").on('submit',function(event){
    let name = $("#appointmentName").val();
    let email = $("#appointmentEmail").val();
    let comment = $("#appointmentComment").val();
    let TimeStamp = getCheckedBoxValue();
    saveAppointment(TimeStamp,name,email,comment);
  });
  $(document).on('submit', '.delete_appointment_form', function (event) {
    let TimeStamp = $(this).find('input[name="delete_timeStamp"]').val();
    deleteAppointment(TimeStamp);
  });
});

$("#search_btn").on("click", function () {
  submitForm();
});
function setMin(){
  document.getElementById("appointmentDate").setAttribute("min",`${dateInSQLFormat()}`);
  let minDate = document.getElementById("appointmentDate").value;
  document.getElementById("appointmentExpireDate").setAttribute("min",`${minDate}`);
  if(minDate == dateInSQLFormat()){
    let todaysDate = new Date();
    let hour = todaysDate.getHours().toString().padStart(2, '0');
    let minute = todaysDate.getMinutes().toString().padStart(2, '0');
    let minTime = `${hour}:${minute}`;
    document.getElementById("appointmentStartTime").setAttribute("min",minTime);
  }
  else {
    document.getElementById("appointmentStartTime").removeAttribute("min");
  }
  let minTime = document.getElementById("appointmentStartTime").value;
  document.getElementById("appointmentEndTime").setAttribute("min",`${minTime}`);
}

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
  let seconds = todaysDate.getSeconds();
  if(type == "without"){
    var result  = `${year}-${month}-${day}`;
  }
  else{
    var result = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
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
      <form class="delete_appointment_form" data-id="${response[i].Create_Date}" method='post'>
        <input type="hidden" value="${response[i].Create_Date}" name="delete_timeStamp">
        <button type="submit" class="btn btn-outline-danger btn-lg m-2">Delete Appointment</button>
      </form>
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
    let checkBox = $(`<input class="checkbox form-check-input-dark" name="checkbox" type="checkbox" value="${response[i].Create_Date}"></input>`);
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
    }
  });
}
function areCheckboxesChecked() {
  let checkboxes = $('.checkbox');
  let cnt = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    if(cnt > 1){
      $('#save_appointment_Btn').attr("disabled",true);
      $('.text_checkbox').text("You Should Choose just one Appointment");
      return false
    }
    if (checkboxes[i].checked) {
        cnt++;
    }
  }
  if(cnt == 1){
    $('.text_checkbox').text("");
    $('#save_appointment_Btn').attr("disabled",false);
    return true;
  }
  $('#save_appointment_Btn').attr("disabled",true);
  $('.text_checkbox').text("You Should Choose an Appointment");
  return false;
}

function saveAppointment(TimeStamp,Name,Email,Comment){
  $.ajax({
    type:'POST',
    url: '../backend/serviceHandler.php',
    data:{
      method: 'saveAppointment',
      param: JSON.stringify({
        Email: Email,
        Name: Name,
        TimeStamp: TimeStamp,
        Comment: Comment,
      })
    }
  })
}
function getCheckedBoxValue(){
  let checkboxes = $('.checkbox');
  for (let i = 0; i < checkboxes.length; i++){
    if (checkboxes[i].checked){
      return checkboxes[i].value;
    }
  }
}
function deleteAppointment(TimeStamp) {
  $.ajax({
    type: 'POST',
    url: '../backend/serviceHandler.php',
    data: {
      method: 'deleteAppointment',
      param: TimeStamp,
    },
  });
};