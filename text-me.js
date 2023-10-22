/**
 * Send a NTFY message with an update of what happened. If the password was used or not...
 */

const fetch = require('node-fetch');

exports.handler = function(context, event, callback) {
	let twiml = new Twilio.twiml.VoiceResponse();

	let bodyText;

	if (event.Method == 'code') {
		bodyText = 'Someone used the password to get in the building.';
	} else {
		bodyText = 'Somebody buzzed the door but didn\'t know the passcode.';
	}

	// send webhook to ntfy
	fetch("https://ntfy.chromart.dynv6.net/buzzer", {
		method: "POST",
		body: bodyText,
	})
		.then(res => callback(null, twiml))
		.catch(err => callback(err, null));
};