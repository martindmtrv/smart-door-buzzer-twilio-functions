/**
 * Fallback behavior, if the code is wrong or unspecified, then we should dial the fallback numbers
 */
exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();

  // numbers are passed in
  let numbers = event.numbers.split(',');

  // If no valid answer after timeout, dial all residents until someone picks up
  let dial = twiml.dial({action: '/text-me?Method=call', timeLimit: 20, timeout: 20});

  numbers.forEach(number => {
    dial.number(number);
  });
   
  return callback(null, twiml);
}