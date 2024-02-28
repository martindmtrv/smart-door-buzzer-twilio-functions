/**
 * Send a NTFY message with an update of what happened. If the password was used or not...
 */

const fetch = require('node-fetch');

exports.handler = function(context, event, callback) {
	let twiml = new Twilio.twiml.VoiceResponse();

	let bodyText;

	if (event.Method == 'doorman') {
		bodyText = 'Doorman buzzed someone up!';
		const fingerprint = JSON.parse(event.fingerprint);
		bodyText += `\n\n${JSON.stringify(fingerprint, null, 4)}`;
	} else if (event.Method == 'doorman-time-lock') {
		bodyText = 'Doorman rejected a buzzer call due to time restriction';
	} else if (event.Method == 'call') {
		bodyText = 'Somebody buzzed the door and it dialed through to a phone.';
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