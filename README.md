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
	.login(process.env.EMAIL, process.env.PASSWORD)
	.then(session => {
		return new Nicovideo(session)
			.download('sm28222588', './videos');
	})
	.then(filePath => {
		console.log('Downloaded:', filePath);
	})
	.catch(err => {
		console.log('Error:', err);
	});
```
