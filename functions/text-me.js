/**
 * Send a NTFY message with an update of what happened. If the password was used or not...
 */

const fetch = require('node-fetch');

exports.handler = function(context, event, callback) {
	let twiml = new Twilio.twiml.VoiceResponse();

	let bodyText;

	if (event.Method == 'doorman') {
		bodyText = 'Someone used doorman to get in the building.';
	} else {
		bodyText = 'Somebody buzzed the door but didn\'t know the passcode.';
	}

	// send webhook to ntfy
	fetch(`https://${context.NTFY_DOMAIN}/buzzer`, {
		method: "POST",
		body: bodyText,
	})
		.then(res => callback(null, twiml))
		// even if we error then we should just end the call normally
		.catch(err => callback(null, twiml));
};