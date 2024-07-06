/**
 *  Simple call box routine
 * 
 *  This function is meant for the apartment building callbox
 *  It gives the user a couple of seconds to produce the password
 * 	Then dials all the residents to grant manual entry
 */
const fetch = require('node-fetch');

exports.handler = async function(context, event, callback) {

  let twiml = new Twilio.twiml.VoiceResponse();

  let config = await fetch(context.DOORMAN_URL + `/api/door/info?buzzer=${event.From}`)
    .then(res => res.json())
    .catch(err => {
      return undefined;
    });

  // reject the call if this is not configured
  if (!config || !config.door) {
    twiml.reject();
    callback(null, twiml);
    return;
  }

  // poll Doorman, to see if we should unlock
  const interval = setInterval(() => {
    fetch(context.DOORMAN_URL + `/api/door/status?door=${config.door}`)
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
    twiml.redirect(`/call-residents?numbers=${encodeURIComponent(config.fallbackNumbers)}`);
    callback(null, twiml);
  }, 6000);
};