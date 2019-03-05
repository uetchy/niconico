#!/usr/bin/env node
// usage: $ NICONICO_EMAIL=<email> NICONICO_PASSWORD=<password> node ./download-video.js <video-id>
const assert = require('assert')
const { niconico, Nicovideo } = require('..')

async function main(email, password, videoID) {
  assert(email, 'no email given')
  assert(password, 'no password given')
  assert(videoID, 'no video id given')

  try {
    const session = await niconico.login(email, password)
    const client = new Nicovideo(session)
    const exportedPath = await client.download(videoID, '.')
    console.log('Downloaded:', exportedPath)
  } catch (err) {
    console.error(err)
  }
}

main(
  process.env.NICONICO_EMAIL,
  process.env.NICONICO_PASSWORD,
  process.argv[2]
).catch((err) => console.error(err.message))
