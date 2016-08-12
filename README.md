# niconico

[![Build Status](https://travis-ci.org/uetchy/niconico.svg?branch=master)](https://travis-ci.org/uetchy/niconico) [![Coverage Status](https://coveralls.io/repos/github/uetchy/niconico/badge.svg?branch=master)](https://coveralls.io/github/uetchy/niconico?branch=master)

niconico API wrapper for Node.JS.

## Installation

```console
$ npm install --save niconico
```

## Usage

```js
const {Nicovideo} = require('niconico');

const client = new Nicovideo(
  email: EMAIL,
  password: PASSWORD,
  output: OUTPUT
);

client.fetchVideo(VIDEO_ID)
  .then(video => {
    console.log(video.title);
    video.download();
  })
  .then((err, output) => {
    if (!err) {
      console.log(output);
    }
  })
  .catch(err => {
    console.log(err);
  });
```
