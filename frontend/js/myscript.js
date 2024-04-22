// Initialisiert das Laden der Seite und bindet Event-Handler
$(document).ready(function () {
  getApointments(); // Lädt vorhandene Termine beim Start
  setMin(); // Setzt minimale Datums- und Zeitwerte für Eingabefelder
  $('#search_form').on('submit', function (event) {
    event.preventDefault();
    submitForm();
  });
  // Event-Handler für das Hinzufügen neuer Termine
  $('#new_appointment_form').on('submit', function (event) {
    let title = $('#appointmentTitle').val();
    let location = $('#appointmentLocation').val();
    let date = $('#appointmentDate').val();
    let expireDate = $('#appointmentExpireDate').val();
    let Description = $('#appointmentDescription').val();
    let startTime = $('#appointmentStartTime').val();
    let endTime = $('#appointmentEndTime').val();

    // Kombiniert Datum und Zeit zu einem vollständigen Zeitstempel
    let startDateTime = date + ' ' + startTime;
    let endDateTime = expireDate + ' ' + endTime;

    // Fügt den neuen Termin hinzu
    addAppointment(title, location, startDateTime, endDateTime, Description);
  });

  // Event-Handler für das Speichern von Termininformationen 
  $('#save_appointment_form').on('submit', function (event) {
    let name = $('#appointmentName').val();
    let email = $('#appointmentEmail').val();
    let comment = $('#appointmentComment').val();
    let TimeStamp = getCheckedBoxValue();
    saveAppointment(TimeStamp, name, email, comment);
  });

  // Event-Handler zum Löschen von Terminen
  $(document).on('submit', '.delete_appointment_form', function (event) {
    let TimeStamp = $(this).find('input[name="delete_timeStamp"]').val();
    deleteAppointment(TimeStamp);
  });
});

// Event-Handler für den Klick auf den Suchbutton (ruft die Suchformular-Funktion auf)
$('#search_btn').on('click', function () {
  submitForm();
});

// Setzt Mindestdaten für Datumseingaben und -werte
function setMin() {
  // Setzt das minimale Datum auf das aktuelle Datum
  document
    .getElementById('appointmentDate')
    .setAttribute('min', `${dateInSQLFormat()}`);
  let minDate = document.getElementById('appointmentDate').value;
  document
    .getElementById('appointmentExpireDate')
    .setAttribute('min', `${minDate}`);
  // Setzt die minimale Startzeit basierend auf der aktuellen Uhrzeit(wenn das Datum heute ist)
  if (minDate == dateInSQLFormat()) {
    let todaysDate = new Date();
    let hour = todaysDate.getHours().toString().padStart(2, '0');
    let minute = todaysDate.getMinutes().toString().padStart(2, '0');
    let minTime = `${hour}:${minute}`;
    document
      .getElementById('appointmentStartTime')
      .setAttribute('min', minTime);
  } else {
    document.getElementById('appointmentStartTime').removeAttribute('min');
  }
  let minTime = document.getElementById('appointmentStartTime').value;
  document
    .getElementById('appointmentEndTime')
    .setAttribute('min', `${minTime}`);
}

// Führt die Suchfunktion aus und filtert die Termine basierend auf der Eingabe
function submitForm() {
  let input = $('#search_input').val();
  getApointments(input);
}

// Erzeugt ein Datum im SQL-Format
function dateInSQLFormat(type = 'without') {
  let todaysDate = new Date();
  let year = todaysDate.getFullYear();
  let month = todaysDate.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = todaysDate.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let hour = todaysDate.getHours();
  let minute = todaysDate.getMinutes();
  let seconds = todaysDate.getSeconds();
  if (type == 'without') {
    var result = `${year}-${month}-${day}`;
  } else {
    var result = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }
  return result;
}

// Führt einen AJAX-GET-Request aus, um Termininformationen anhand der Termin-ID zu holen
function getAppointmentInformation(appID) {
  return $.ajax({
    type: 'GET',
    url: '../backend/serviceHandler.php',
    cache: false,
    data: { method: 'getAppointmentInformation', param: appID },
    dataType: 'json',
  });
}

// Erstellt Termin-Karten und fügt sie in das DOM ein
function createAppointment(response) {
  let appointmentList = $('#appointment_list');
  appointmentList.empty(); // Leert die Liste vor dem Hinzufügen neuer Elemente
  for (let i = 0; i < response.length; i++) {
    // Erzeugt die Struktur der Termin-Karte
    let cardDiv = $(
      '<div class="d-flex flex-column align-items-center"></div>',
    );
    let appointmetli = $(
      '<div class="card text-center text-white bg-dark m-3 p-3 rounded" style="min-width:16rem;"></div>',
    );
    let appointmentDiv = $('<div class="card-body"></div>');
    let title = $('<h5 class="card-title">' + response[i].Title + '</h5>');
    let location = $('<p class="card-text">' + response[i].Location + '</p>');
    let date = $(
      '<p class="card-text">Date:</p> <p class="card-text">' +
        response[i].Date +
        '</p>',
    );
    let expireDate = $(
      '<p class="card-text">Expire Date:</p> <p class="card-text">' +
        response[i].Expiry_Date +
        '</p>',
    );
    let footerDiv = $('<div class="d-flex justify-content-center"></div>');
    let dateDiff =
      new Date().getDate() - new Date(response[i].Create_Date).getDate();
    if (dateDiff == 0) {
      var dateCreated = $(
        `<div class="card-footer text-dark bg-light rounded">Today</div>`,
      );
    } else {
      // Fügt Informationen zum Erstellungsdatum hinzu
      var dateCreated = $(
        `<div class="card-footer text-dark bg-light rounded">${dateDiff} day ago </div>`,
      );
    }
    let collapseBtn = $(
      `<button class="btn btn-outline-info btn-sm ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample${i}" aria-expanded="false" aria-controls="offcanvasExample${i}">More Info</button>`,
    );
    footerDiv.append(dateCreated, collapseBtn);
    // Erstellt einen ausklappbaren Bereich für zusätzliche Informationen
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
    if (response[i].Voting == '1') {
      // Holt zusätzliche Informationen, wenn Voting aktiviert ist
      getAppointmentInformation(response[i].Appointment_id).success(function (
        infoResponse,
      ) {
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
      });
    } else {
      var collapseBody = $(`
      <div class="offcanvas-body">
        <p>${response[i].Description}</p>
      </div>`);
      collapseDiv.append(collapseBody);
    }
    // Fügt alle Teile zusammen und setzt die Termin-Karte in das DOM ein
    appointmentDiv.append(
      title,
      location,
      date,
      expireDate,
      footerDiv,
      collapseDiv,
    );
    appointmetli.append(appointmentDiv);
    let checkBox = $(
      `<input class="checkbox form-check-input-dark" name="checkbox" type="checkbox" value="${response[i].Create_Date}"></input>`,
    );
    // 
    if (response[i].Voting == '1') {
      checkBox.attr('disabled', true);
      appointmetli.css({
        background:
          'repeating-linear-gradient(45deg,grey,grey 10px,green 10px,green 20px)',
      });
    }
    if (
      response[i].Date < dateInSQLFormat('with') &&
      response[i].Voting == '0'
    ) {
      checkBox.attr('disabled', true);
      appointmetli.css({
        background:
          'repeating-linear-gradient(45deg,grey,grey 10px,black 10px,black 20px)',
      });
    }
    cardDiv.append(appointmetli);
    cardDiv.append(checkBox);
    if (
      response[i].Voting == '0' &&
      response[i].Date >= dateInSQLFormat('with')
    ) {
      appointmentList.prepend(cardDiv);
    } else {
      appointmentList.append(cardDiv);
    }
  }
}

// Führt einen AJAX-GET-Request aus um Termine abzurufen
function getApointments(param = null) {
  $.ajax({
    type: 'GET',
    url: '../backend/serviceHandler.php',
    cache: false,
    data: { method: 'getApointments', param: param },
    dataType: 'json',
    success: function (response) {
      if (response == null) {
        let appointmentList = $('#appointment_list');
        appointmentList.empty();
        appointmentList.css({ width: 'auto' });
        appointmentList.append(
          "<div class='text-danger w-100' style='text-align:center;'>Nothing Found </div>",
        );
      } else {
        createAppointment(response);
      }
    },
  });
}

// Führt einen AJAX-POST-Request aus, um einen neuen Termin zu speichern
function addAppointment(
  title,
  location,
  startDateTime,
  endDateTime,
  description,
) {
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
  });
}

// Überprüft, ob genau ein Checkbox-Element ausgewählt ist
function areCheckboxesChecked() {
  let checkboxes = $('.checkbox');
  let cnt = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    if (cnt > 1) {
      $('#save_appointment_Btn').attr('disabled', true);
      $('.text_checkbox').text('You Should Choose just one Appointment');
      return false;
    }
    if (checkboxes[i].checked) {
      cnt++;
    }
  }
  if (cnt == 1) {
    $('.text_checkbox').text('');
    $('#save_appointment_Btn').attr('disabled', false);
    return true;
  }
  $('#save_appointment_Btn').attr('disabled', true);
  $('.text_checkbox').text('You Should Choose an Appointment');
  return false;
}

// Führt einen AJAX-POST-Request aus, um ausgewählte Termininformationen zu speichern
function saveAppointment(TimeStamp, Name, Email, Comment) {
  $.ajax({
    type: 'POST',
    url: '../backend/serviceHandler.php',
    data: {
      method: 'saveAppointment',
      param: JSON.stringify({
        Email: Email,
        Name: Name,
        TimeStamp: TimeStamp,
        Comment: Comment,
      }),
    },
  });
}

// Gibt den Wert des ausgewählten Checkboxes zurück
function getCheckedBoxValue() {
  let checkboxes = $('.checkbox');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      return checkboxes[i].value;
    }
  }
}

// Führt einen AJAX-POST-Request aus, um einen Termin zu löschen
function deleteAppointment(TimeStamp) {
  $.ajax({
    type: 'POST',
    url: '../backend/serviceHandler.php',
    data: {
      method: 'deleteAppointment',
      param: TimeStamp,
    },
  });
}
