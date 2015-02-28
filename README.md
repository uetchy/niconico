# niconico

## Installation

```console
$ npm install --save niconico
```

## Usage

```js
var niconico = require('niconico');

nv = new niconico.Nicovideo(
  email: EMAIL,
  password: PASSWORD,
  output: OUTPUT
);

nv.fetch_video(VIDEO_ID)
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
