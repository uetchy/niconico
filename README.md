# niconico

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
