/**
 * Automatically open the door
*/
exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();

  // TODO: pass along the info from doorman
  let passAlong = ``;
  console.log(passAlong);

  twiml.play('https://smart-door-buzzer-3172.twil.io/buzzing_up_boosted.mp3');
  twiml.play({digits: '6'}); // press 6 to let them in, for my building
  twiml.pause({ length:1 });
  twiml.redirect(`/text-me?Method=doorman&${passAlong}`);

  callback(null, twiml);
};