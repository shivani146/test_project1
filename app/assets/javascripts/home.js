var doctors = gon.doctors;

var div1_source   = $("#div1-template-id").html();
var div1_template = Handlebars.compile(div1_source);

var div2_source   = $("#div2-template-id").html();
var div2_template = Handlebars.compile(div2_source);

var div3_source   = $("#div3-template-id").html();
var div3_template = Handlebars.compile(div3_source);

var div4_source   = $("#div4-template-id").html();
var div4_template = Handlebars.compile(div4_source);

function render_patient() {
    var html = div1_template;

    var body_div = $("#div1-container-modal-div");

    body_div.html(html);
}
function render_doctor() {

    var html = div2_template;

    var body_div = $("#div2-container-modal-div");

    body_div.html(html);
}
function render_appointments() {
    $.ajax({
        type: "POST",
        url: "/details",
        success: function (data) {
            gon.patients = data.patients;
            gon.doctors = data.doctors;
            var html = div3_template(data);
            var body_div = $("#div3-container-modal-div");

            body_div.html(html);
            view_appointments(data.doctors,data.patients);
        },
        error: function (xhr, status, errorThrown) {
        },
        data: {
            attendance_date: $('[name="order_date_from"]').val(),
            json: true,
            authenticity_token: AUTH_TOKEN
        }
    });
}

function view_appointments(doctors,patients) {
    var table_content = [];
    if (doctors == null) {
        return;
    }
    var patient_hash = {};
    if (patients != null) {
        for (var i = 0, len = patients.length; i < len; i++) {
            var patient = patients[i];
            patient_hash[patient._id.$oid] = patient;
        }
    }
    if (doctors != null) {
        var staffs_hash = {};
        for(var i = 0; i < doctors.length; i++) {
            var doctor = doctors[i];
            if (doctor.patients != null) {
                for (var j = 0, len = doctor.patients.length; j < len; j++) {
                    var single_patient = doctor.patients[j];
                    var patient = patient_hash[single_patient];
                    if (patient != null)
                    {
                        view_appointment(table_content,patient,doctor,patient_hash);
                    }
                }
            }
        }
    }
}

function view_appointment(table_content,patient,doctor,patient_hash) {
    var table_row = {};
    table_row['doctor_name'] = doctor.name;
    table_row['patient_name'] = patient.name;
    table_row['disease'] = patient.disease;
    table_content.push(table_row);

    var patient_name = null;
    var disease = null;
    var data = {animals: table_content

    };
    var html = div4_template(data);
    var body_div = $("#div4-container-modal-div");
    body_div.html(html);
}

function create_patient()
{
    if (/^\d{10}$/.test ($('#phone').val()) ){
        $.ajax({
            type: "POST",
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
            url: '/create_patient',
            success: function (data) {
                alert("Patient Data saved successfully");

            },
            error: function (xhr, status, errorThrown) {
                // Reset DropDown
                alert("Something went wrong while saving patient data");
                var errors = $.parseJSON(xhr.responseText).errors;
            },
            data: {
                name: $('#name').val(),
                phone: $('#phone').val()
            }
        });
    } else {
        alert("Phone number should be exactly 10 digits long");
        return false;
    }


}
function create_doctor()
{
    if (/^\d{10}$/.test ($('#Phone').val()) ) {
        $.ajax({
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
            },
            url: '/create_doctor',
            success: function (data) {
                alert("Doctor's Data saved successfully");

            },
            error: function (xhr, status, errorThrown) {
                // Reset DropDown
                alert("Something went wrong while saving doctor's data");
                var errors = $.parseJSON(xhr.responseText).errors;
            },
            data: {
                name: $('#Name').val(),
                phone: $('#Phone').val(),
                specialisation: $('#specialisation').val()
            }
        });
    }else {
        alert("Phone number should be exactly 10 digits long");
        return false;
    }

}

function render_patients_details(ele)
{
    var patients = gon.patients;
    console.log(patients);
    if (patients === null) {
        alert("Please report this to technology team");
        return;
    }

    $(ele)
        .find('option')
        .remove()
        .end();

    $(ele).append('<option value="" selected>Patients</option>');
    for (i = 0, len = patients.length; i < len; ++i) {
        var patient = patients[i];
        var name = patient.name;

        var patient_id = patient._id.$oid;
        console.log("asdfg" + patient._id.$oid);
        $(ele).append('<option value="' + patient_id + '">' + name + '</option>');
    }
}
function render_doctors_details(ele)
{
    var doctors = gon.doctors;
    console.log(doctors);
    if (doctors === null) {
        alert("Please report this to technology team");
        return;
    }

    $(ele)
        .find('option')
        .remove()
        .end();

    $(ele).append('<option value="" selected>Doctors</option>');
    for (i = 0, len = doctors.length; i < len; ++i) {
        var doctor = doctors[i];
        var name = doctor.name;
        var doctor_id = doctor._id.$oid;
        $(ele).append('<option value="' + doctor_id + '">' + name + '</option>');
    }
}
function create_appointment()
{
    $.ajax({
        type: "POST",
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: '/appointment_details',
        success: function (data) {
            alert("Doctor's Data saved successfully");

        },
        error: function (xhr, status, errorThrown) {
            // Reset DropDown
            alert("Something went wrong while saving doctor's data");
            var errors = $.parseJSON(xhr.responseText).errors;
        },
        data: {
            doctor_name: $('#doctor_name').val(),
            patient_name: $('#patient_name').val(),
            disease: $('#disease').val()
        }
    });

}




jQuery(document).ready(function() {
    render_patient();
    render_doctor();
    render_appointments();
    // view_appointments();
    //setInterval(doPoll, 2000); //2 seconds
});
