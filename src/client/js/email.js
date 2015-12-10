/*  Send emails via mandrill's API.
 *
 *  Requires: jQuery.
 */

(function(email, $, undefined) {
  var key = 'fBENb5Z2RPSpqs-mTRa_VA';  // Expires after 2000 emails.

  email.send = send;

  /**
   * Sends an email using mandrill.
   * @param {Object} message
   * @param {string} message.subject
   * @param {string} message.text
   * @param {Object[]} to
   * @param {string} to[].email
   * @param {string} [to[].name]
   * @param {string} [to[].type=to] - The header type for the recipient (to, cc, or bcc).
   * @param {Object} from
   * @param {string} from.email
   * @param {string} [from.name]
   * @returns {jqXHR} Response JSON from mandrill API.
   */
  function send(message, to, from) {
    // Return mandrill API call.
    // In the event of an error, the response will be an object with status, code, name, and message properties.
    // Otherwise, the response will be an array of objects with email, status, reject_reason, and _id properties (status === "sent" if sent).
    return $.ajax({
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': key,
        'message': {
          'text': message.text,
          'subject': message.subject,
          'from_email': from.email,
          'from_name': from.name,
          'to': to
        }
      },
      method: 'POST'
    });
  }
})(window.email = window.email || {}, jQuery);
