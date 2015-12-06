(function(email, $, undefined) {
  var key = 'fBENb5Z2RPSpqs-mTRa_VA';  // Expires after 2000 emails.
  var subject = 'Portfolio Contact Form';
  var to = [{
      'email': 'tempurturtul@gmail.com',
      'name': 'Tempurturtul',
      'type': 'to'
    }];

  email.send = send;

  function send(message, name, email) {
    if (!message) {
      return undefined;
    }
    if (!name) {
      name = 'Anonymous Contact';
    }
    if (!email) {
      email = 'placeholder@notreal.net';
    }

    // Return mandrill API call.
    return $.ajax({
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': key,
        'message': {
          'text': message,
          'subject': subject,
          'from_email': email,
          'from_name': name,
          'to': to
        }
      },
      method: 'POST'
    });
  }
})(window.email = window.email || {}, jQuery);
