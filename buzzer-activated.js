/**
 *  Simple call box routine
 * 
 *  This function is meant for the apartment building callbox
 *  It gives the user a couple of seconds to produce the password
 * 	Then dials all the residents to grant manual entry
 */
exports.handler = function(context, event, callback) {

  let twiml = new Twilio.twiml.VoiceResponse();

  console.log(event);

  // reject the call if it does not come from the callbox
  if (!event.From.includes(context.BUZZER_PHONE)) {
    twiml.reject();
    callback(null, twiml);
    return;
  }

  // Gather both speech and digit entry from user
  twiml
    .gather({
      action: '/door-open',
      hints: context.PASSPHRASE,
      input: 'speech dtmf',
      numDigits: '4',
      speechTimeout: 'auto',
      timeout: 2,
    })
    .say({voice: 'woman'}, 'Enter code, or hold');

  twiml.redirect('/call-residents');
  callback(null, twiml);
};