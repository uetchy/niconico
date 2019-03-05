#!/usr/bin/env node
// example: $ EMAIL=<email> PASSWORD=<password> node ./download-video.js <video-id>

const assert = require('assert')
const { niconico, Nicovideo } = require('..')

async function main(email, password, videoID) {
  assert(email, 'no EMAIL given')
  assert(password, 'no PASSWORD given')
  assert(videoID, 'no videoID given')

  try {
    const session = await niconico.login(email, password)
    const client = new Nicovideo(session)
    const exportedPath = await client.download(videoID, '.')
    console.log('Downloaded:', exportedPath)
  } catch (err) {
    console.error(err)
  }
}

main(process.env.EMAIL, process.env.PASSWORD, process.argv[2])
