var twilio = require('twilio');
var client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = {
  send: function (phone, message, cb) {
    client.messages
      .create({ body: message, to: '+1' + phone, from: '+16075582140' })
      .then((message) =>
        cb(null, { status: 'OK', message: 'The text was successfully sent to: ' + '+1' + phone, messageId: message.sid }))
      .catch((error) => cb(null, { status: 'ERROR', error }));
  },
};
