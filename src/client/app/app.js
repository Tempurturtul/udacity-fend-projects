$(document).ready(function() {
  // The contact form overlay message.
  var $contactNotification = $('#contact-notification');
  // The ID of the nav target currently navigated to.
  var currentNavTargetID = '';

  // On scroll...
  $(window).on('scroll', handleNav);

  // On contact form submit...
  $('#contact-form').on('submit', submitContactForm);

  // On .click-to-hide click...
  $('.click-to-hide').on('click', function() {
    var $elem = $(this);
    // Make sure the class hasn't been removed.
    if ($elem.hasClass('click-to-hide')) {
      $elem.addClass('hidden');
    }
  });

  function handleNav() {
    var $nav = $('nav');
    // The current scrolled-to position.
    var y = $(document).scrollTop();

    // Stick or unstick the nav from the top.
    stickOrUnstick();
    // Set the nav target being viewed as current.
    assignCurrent();

    function stickOrUnstick() {
      // The position of the nav bar when not stuck to top.
      var navPos = $('#sticky-nav-container').offset().top;

      // If we're above navPos...
      if (y < navPos) {
        // Unstick the nav.
        $nav.removeClass('stick-top');
      }
      // If we're at or below navPos...
      else {
        // Stick the nav to the top.
        $nav.addClass('stick-top');
      }
    }

    function assignCurrent() {
      var $navLinks = $('nav ul').find('li a');
      var $navTargets = $('.nav-target');
      var newNavTargetID = '';

      // For every nav target...
      for (var i = 0; i < $navTargets.length; i++) {
        // If we've not scrolled to or below its top...
        if (y < $($navTargets[i]).offset().top) {
          break;
        }

        // If we have scrolled to or below its top, set it as the new target and continue the loop.
        newNavTargetID = '#' + $($navTargets[i]).attr('id');
      }

      // If the new target doesn't match the current target...
      if (newNavTargetID !== currentNavTargetID) {
        // For each nav link...
        $navLinks.each(function() {
          // If the nav link has the current class, remove it.
          if ($(this).hasClass('current')) {
            $(this).removeClass('current');
          }
          // Otherwise, if the nav link is to the new target, add the class.
          else if ($(this).attr('href') === newNavTargetID) {
            $(this).addClass('current');
          }
        });

        // Set the new current nav target id.
        currentNavTargetID = newNavTargetID;
      }
    }
  }

  function submitContactForm() {
    // Disable form inputs.
    $('#contact-form').find('button').prop('disabled', true);
    $('#contact-form').find('input').prop('disabled', true);
    $('#contact-form').find('textarea').prop('disabled', true);

    // Attempt to send email.
    sendEmail()
      // Handle success.
      .done(function(data, textStatus, jqXHR) {
        // Check if the message was sent.
        if (data[0].status === 'sent') {
          // Notify user that the message was sent.
          displayNotification($contactNotification, 'Message sent!', true);
        } else {
          // Notify user that the message failed to send.
          displayNotification($contactNotification, ['Message failed to send...', data.message]);
          // Re-enable form inputs.
          $('#contact-form').find('button').prop('disabled', false);
          $('#contact-form').find('input').prop('disabled', false);
          $('#contact-form').find('textarea').prop('disabled', false);
        }
      })
      // Handle failure.
      .fail(function(jqXHR, textStatus, errorThrown) {
        // Notify user that the message failed to send.
        displayNotification($contactNotification, ['Message failed to send...', errorThrown]);
        // Re-enable form inputs.
        $('#contact-form').find('button').prop('disabled', false);
        $('#contact-form').find('input').prop('disabled', false);
        $('#contact-form').find('textarea').prop('disabled', false);
      });

    // Prevent form submit from reloading page.
    return false;
  }

  function sendEmail() {
    var name = $('#name').val().toString() || 'Anonymous Contact';
    var email = $('#email').val().toString() || 'placeholder@notreal.net';
    var message = $('#message').val().toString();

    // Return mandrill API call.
    return $.ajax({
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': 'fBENb5Z2RPSpqs-mTRa_VA',  // Expires after 2000 emails.
        'message': {
          'text': message,
          'subject': 'Portfolio Contact Form',
          'from_email': email,
          'from_name': name,
          'to': [
            {
              'email': 'tempurturtul@gmail.com',
              'name': 'Tempurturtul',
              'type': 'to'
            }
          ]
        }
      },
      method: 'POST'
    });
  }

  function displayNotification($element, msgs, persistent) {
    // Clear existing messages.
    $element.find('p').remove();

    // Add msgs.
    if (Array.isArray(msgs)) {
      msgs.forEach(function(msg) {
        $element.append('<p>' + msg + '</p>');
      });
    } else {
      $element.append('<p>' + msgs + '</p>');
    }

    // If not hideable...
    if (persistent) {
      $element.removeClass('click-to-hide');
    }

    // Unhide the notification.
    $element.removeClass('hidden');
  }

});
