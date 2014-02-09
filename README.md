# niconico

## Installation
```
$ npm install niconico --save
```

## Usage

```coffee
niconico = require('niconico')

nicovideo = new niconico.Nicovideo(
  email: EMAIL,
  password: PASSWORD,
  folder: FOLDER
)

nicovideo.download(VIDEO_ID)
nicovideo.on 'fetched', (status, meta) ->
  console.log "Title: #{meta.title}"
nicovideo.on 'exported', (filepath) ->
  console.log 'Exported'
```