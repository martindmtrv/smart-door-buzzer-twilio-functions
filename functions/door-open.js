/**
 * Handle the door auth, check the voice / dial pad result to see if it matches the expected value.
 * If we are matching, then press 6 to let the person in
*/
exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();
  

  let cleanString = "";

  // Get rid of random non-alphabetical chars and put to lower case, if there was some speech
  if (event.SpeechResult !== undefined) {
    cleanString = event.SpeechResult
                    .replace(/[^\w\s]|_/g, "")
                    .replace(/\s+/g, " ");
  }

  let cleanSpeechResult = cleanString.toLowerCase();
  
  console.log('Speech: ' + cleanSpeechResult + '; confidence: ' + event.Confidence);
  console.log('Digits: ' + event.Digits);
  
  if ( (cleanSpeechResult === context.PASSPHRASE && event.Confidence > 0.5) 
          || event.Digits === context.PASSCODE) {
    // Check if we have a password match, and open the door
    twiml.say({voice: 'man'}, 'Buzzing you up now!');
    twiml.play({digits: '6'}); // press 6 to let them in, for my building
    twiml.pause({length:1});

    // Also send me a text on this 
    twiml.redirect('/text-me?Method=code');
    callback(null, twiml);
	} else {
    twiml.redirect('/call-residents');
    callback(null, twiml);
  }
};