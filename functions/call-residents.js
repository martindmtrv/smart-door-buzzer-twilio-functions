/**
 * Fallback behavior, if the code is wrong or unspecified, then we should dial the fallback numbers
 */
exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();
  
  // If no valid answer after timeout, dial all residents until someone picks up
  let dial = twiml.dial({action: '/text-me?Method=call', timeLimit: 20, timeout: 20});

  if (!event.From.includes(context.GRACIE_PHONE)) {
    dial.number(context.GRACIE_PHONE);
  }

  if (!event.From.includes(context.MARTIN_PHONE)) {
    dial.number(context.MARTIN_PHONE);
  }
   
  callback(null, twiml);
}