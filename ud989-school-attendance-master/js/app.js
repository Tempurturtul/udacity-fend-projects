/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

/* REFACTOR */
$(document).ready(function() {
  var model = {
    getAllAttendance: function() {
      // Return attendance data for all students.
      return JSON.parse(localStorage.attendance);
    },

    getAttendance: function(name) {
      // Return attendance data for named student.
      return this.getAllAttendance()[name];
    },

    setAttendance: function(name, data) {
      // Set attendance data for named student.
      var attendance = this.getAllAttendance();

      attendance[name] = data;

      localStorage.attendance = JSON.stringify(attendance);
    },

    getMissed: function(name) {
      // Return named student's missed days total.
      var attendance = this.getAttendance(name);

      return attendance.reduce(function(acc, curr) {
        if (!curr) {
          acc++;
        }

        return acc;
      }, 0);
    }
  };

  var octopus = {
    init: function() {
      // Model is initialized on lines 6-27.

      view.init();
    },

    getDays: function() {
      // Return the maximum number of days for which attendance is recorded.
      var allAttendance = model.getAllAttendance(),
          maxDays = 0;

      for (var student in allAttendance) {
        maxDays = Math.max(maxDays, allAttendance[student].length);
      }

      return maxDays;
    },

    getAllAttendance: function() {
      return model.getAllAttendance();
    },

    getAttendance: function(name) {
      return model.getAttendance(name);
    },

    changeAttendance: function(name, dayIndex, attended) {
      var attendance = model.getAttendance(name);

      attendance[dayIndex] = attended;

      model.setAttendance(name, attendance);
      view.update();
    },

    getMissed: function(name) {
      return model.getMissed(name);
    }
  };

  var view = {
    init: function() {
      var days = octopus.getDays(),
          attendance = octopus.getAllAttendance(),
          $tbody = $('tbody'),
          i;

      // Create a column in the table head for each day.
      var htmlStr = '';
      for (i = 1; i <= days; i++) {
        htmlStr += '<th>' + i + '</th>';
      }
      $('thead .name-col').after(htmlStr);

      // Create a row in the table body for each student.
      for (var student in attendance) {
        $tbody.append('<tr class="student">' +
                      '<td class="name-col">' + student + '</td>' +
                      '</tr>');

        var $lastStudent = $('.student:last');
        // Create inputs for each day.
        for (i = 0; i < attendance[student].length; i++) {
          var inputElem = document.createElement('input');
          inputElem.type = 'checkbox';
          inputElem.checked = attendance[student][i];
          inputElem.addEventListener('change', changeFn(student, i), false);

          $lastStudent.append(inputElem);
          $('input:last').wrap('<td class="attend-col"></td>');
        }

        // Create the missed days column.
        $lastStudent.append('<td class="missed-col">' + octopus.getMissed(student) + '</td>');
      }

      function changeFn(name, dayIndex) {
        return function() {
          var attended = $(this).prop('checked');
          octopus.changeAttendance(name, dayIndex, attended);
        };
      }
    },

    update: function() {
      // Update the student rows to reflect the students' attendance.
      $('.student').each(function(){
        var student = $(this).children('.name-col').text(),
            attendance = octopus.getAttendance(student),
            missed = octopus.getMissed(student),
            $attends = $(this).find('input'),
            $missed = $(this).children('.missed-col');

        $attends.each(function(index) {
          $(this).prop('checked', attendance[index]);
        });

        $missed.text(missed);
      });
    }
  };

  octopus.init();
});


/* OLD CODE */
// /* STUDENT APPLICATION */
// $(function() {
//     var attendance = JSON.parse(localStorage.attendance),
//         $allMissed = $('tbody .missed-col'),
//         $allCheckboxes = $('tbody input');
//
//     // Count a student's missed days
//     function countMissing() {
//         $allMissed.each(function() {
//             var studentRow = $(this).parent('tr'),
//                 dayChecks = $(studentRow).children('td').children('input'),
//                 numMissed = 0;
//
//             dayChecks.each(function() {
//                 if (!$(this).prop('checked')) {
//                     numMissed++;
//                 }
//             });
//
//             $(this).text(numMissed);
//         });
//     }
//
//     // Check boxes, based on attendace records
//     $.each(attendance, function(name, days) {
//         var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
//             dayChecks = $(studentRow).children('.attend-col').children('input');
//
//         dayChecks.each(function(i) {
//             $(this).prop('checked', days[i]);
//         });
//     });
//
//     // When a checkbox is clicked, update localStorage
//     $allCheckboxes.on('click', function() {
//         var studentRows = $('tbody .student'),
//             newAttendance = {};
//
//         studentRows.each(function() {
//             var name = $(this).children('.name-col').text(),
//                 $allCheckboxes = $(this).children('td').children('input');
//
//             newAttendance[name] = [];
//
//             $allCheckboxes.each(function() {
//                 newAttendance[name].push($(this).prop('checked'));
//             });
//         });
//
//         countMissing();
//         localStorage.attendance = JSON.stringify(newAttendance);
//     });
//
//     countMissing();
// }());
//
