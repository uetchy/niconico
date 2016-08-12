# niconico

[![Build Status](https://travis-ci.org/uetchy/niconico.svg?branch=master)](https://travis-ci.org/uetchy/niconico) [![Coverage Status](https://coveralls.io/repos/github/uetchy/niconico/badge.svg?branch=master)](https://coveralls.io/github/uetchy/niconico?branch=master)

niconico API wrapper for Node.JS.

## Installation

```console
$ npm install --save niconico
```

## Usage

```js
const {niconico, Nicovideo} = require('niconico');

return niconico
	.getSessionCookie(process.env.EMAIL, process.env.PASSWORD)
	.then(sessionCookie => {
		const agent = new Nicovideo(sessionCookie);
		agent.download('sm28222588', './videos');
	})
	.then(destinationPath => {
		console.log('Downloaded:', destinationPath);
	})
	.catch(err => {
		console.log('Error:', err);
	});
```
