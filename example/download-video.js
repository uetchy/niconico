#!/usr/bin/env node
// example: $ EMAIL=<email> PASSWORD=<password> node ./download-video.js <video-id>

const VIDEO_ID = process.argv[2];

const {niconico, Nicovideo} = require('..');

return niconico
	.login(process.env.EMAIL, process.env.PASSWORD)
	.then(session => {
		return new Nicovideo(session).download(VIDEO_ID, '.');
	})
	.then(filePath => {
		console.log('Downloaded:', filePath);
	})
	.catch(err => {
		console.log('Error:', err);
	});
