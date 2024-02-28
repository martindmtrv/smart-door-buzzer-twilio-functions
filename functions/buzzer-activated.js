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
  const interval = setInterval(() => {
    fetch(context.DOORMAN)
      .then(async res => {
        // handle the case where doorman is explictly rejecting the buzzer
        if (res.status === 410) {
          clearInterval(interval);
          twiml.redirect('/text-me?method=doorman-time-lock');
          callback(null, twiml);
        } 
        
        // we got the successful unlock
        else if (res.status === 200) {
          clearInterval(interval);
          
          const body = await res.json();
          twiml.redirect(`/door-open?fingerprint=${encodeURIComponent(JSON.stringify(body))}`);
          callback(null, twiml);
        }
      })
      .catch(err => console.log(err));
  }, 500);

  // redirect to call after 6s
  setTimeout(() => {
    twiml.redirect('/call-residents');
    callback(null, twiml);
  }, 6000);
};