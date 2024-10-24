/**
 * Automatically open the door
*/
exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();

  let passAlong = `fingerprint=${encodeURIComponent(event.fingerprint)}`;

  twiml.play('https://smart-door-buzzer-3172.twil.io/buzzing_up_boosted.mp3');
  twiml.play({ digits: event.pressKey }); // configured in doorman what button to click and passed into this function
  twiml.pause({ length: 1 });
  twiml.redirect(`/text-me?Method=doorman&${passAlong}`);

  callback(null, twiml);
};