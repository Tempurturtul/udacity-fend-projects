$(document).ready(function() {
  // The contact form overlay message.
  var $contactNotification = $('#contact-notification');
  // The ID of the nav target currently navigated to.
  var currentNavTargetID = '';

  // On scroll...
  $(window).on('scroll', handleNav);

  // On click...
  $('body').on('click', function(e) {
    // Remove any existing popups.
    $('body').children('.popup').remove();

    // If the click was on a .popup-source element...
    if (e.target.classList.contains('popup-source')) {
      // Open a new popup.
      var msg = '';
      var pos = {
        x: e.pageX,
        y: e.pageY
      };

      switch (e.target.id) {
        case 'languages':
          msg = '<ul>' +
                '<li>JavaScript</li>' +
                '<li>C#</li>' +
                '<li>Python</li>' +
                '<li>Ruby</li>' +
                '<li>SML</li>' +
                '<li>Racket</li>' +
                '</ul>';
          break;
        case 'web-technologies':
          msg = '<ul>' +
                '<li>jQuery</li>' +
                '<li>Knockout</li>' +
                '<li>Polymer</li>' +
                '<li>AngularJS</li>' +
                '<li>Node.js</li>' +
                '<li>Gulp</li>' +
                '<li>Grunt</li>' +
                '<li>Bower</li>' +
                '<li>Vagrant</li>' +
                '<li>Git</li>' +
                '</ul>';
          break;
        case 'new-things':
          msg = '<ul>' +
                '<li>CSS Preprocessors</li>' +
                '<li>Web Workers</li>' +
                '<li>Service Workers</li>' +
                '<li>IndexedDB API</li>' +
                '<li>SQL and NoSQL</li>' +
                '<li>many more...</li>' +
                '</ul>';
          break;
      }

      popup(msg, pos);
    }
  });

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

    // Activate sending overlay.
    displayNotification($contactNotification, 'Sending...', true);

    // Attempt to send email.
    sendEmail()
      // Handle success.
      .done(function(data, textStatus, jqXHR) {
        // Check if the message was sent.
        if (data.success) {
          // Notify user that the message was sent.
          displayNotification($contactNotification, 'Message sent!', true);
        } else {
          // Notify user that the message failed to send.
          displayNotification($contactNotification, ['Sorry! Your message failed to send.', data[0]]);
          console.warn(data);
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
    var name = $('#name').val().toString() || '';
    var email = $('#email').val().toString() || '';
    var message = $('#message').val().toString();

    // Return formspree API call.
    return $.ajax({
      url: "//formspree.io/tempurturtul@gmail.com",
      method: "POST",
      data: {
        email: email,
        name: name,
        message: message,
        _subject: 'Portfolio Contact Form'
      },
      dataType: "json"
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
    } else {
      $element.addClass('click-to-hide');
    }

    // Unhide the notification.
    $element.removeClass('hidden');
  }

  /**
   * Creates a dismissable popup message at the given position.
   * @param {string} msg
   * @param {Object} pos
   * @param {number} pos.x
   * @param {number} pos.y
   */
  function popup(msg, pos) {
    var $body = $('body');

    // If the body is wider than 300 px...
    if ($body.width() >= 300) {
      // If the popup would extend beyond the edge of the body...
      if (pos.x + 300 > $body.width()) {
        // Reposition the popup so it doesn't extend beyond the edge of the body.
        pos.x = $body.width() - 300;
      }
    }
    // Otherwise...
    else {
      // Reposition the popup to the left edge of the body.
      pos.x = 0;
    }

    var requiredStyling = 'max-width: 300px;' +
                          'position: absolute;' +
                          'top: ' + pos.y + 'px;' +
                          'left: ' + pos.x + 'px;';
    var elem = '<div class="popup" style="' + requiredStyling + '">' + msg + '</div>';

    // Add new popup.
    $body.append(elem);
  }

});
