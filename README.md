# niconico

## Installation

```console
$ npm install --save niconico
```

## Usage

```js
var niconico = require('niconico');

nicovideo = new niconico.Nicovideo(
  email: EMAIL,
  password: PASSWORD,
  output: OUTPUT
);

nicovideo.fetch_video(VIDEO_ID)
  .then(function(video){
    console.log(video.title)
    video.download()
  })
  .then(function(err, output){
    if (!err) {
      console.log(output)
    }
  })
```
