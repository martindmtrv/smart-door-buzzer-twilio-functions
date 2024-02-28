/**
 *  Simple call box routine
 * 
 *  This function is meant for the apartment building callbox
 *  It gives the user a couple of seconds to produce the password
 * 	Then dials all the residents to grant manual entry
 */
const fetch = require('node-fetch');

exports.handler = function(context, event, callback) {

  let twiml = new Twilio.twiml.VoiceResponse();

  console.log(event);

  // reject the call if it does not come from the callbox and did not come from my number for testing
  if (!event.From.includes(context.BUZZER_PHONE) && !event.From.includes(context.MARTIN_PHONE)) {
    twiml.reject();
    callback(null, twiml);
    return;
  }

  // poll Doorman, to see if we should unlock
  setInterval(() => {
    fetch(context.DOORMAN)
      .then(async res => {
        if (res.status === 200) {
          const body = await res.json();

          // clear the existing door status
          await fetch(context.DOORMAN, { method: "DELETE" });

          twiml.redirect(`/door-open?fingerprint=${encodeURIComponent(JSON.stringify(body))}`);
          callback(null, twiml);
        }
      })
      .catch(err => console.log(err));
  }, 500);

  // redirect to call if no poll success
  setTimeout(() => {
    twiml.redirect('/call-residents');
    callback(null, twiml);
  }, 6000);
};