#!/usr/bin/env node
// example: $ node ./video-information.js <video-id>

const VIDEO_ID = process.argv[2]

const { Nicovideo } = require('..')

new Nicovideo()
  .thumbinfo(VIDEO_ID, '.')
  .then(thumbinfo => {
    console.log(thumbinfo)
  })
  .catch(err => {
    console.log('Error:', err)
  })
