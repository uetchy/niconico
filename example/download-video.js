#!/usr/bin/env node
// example: $ EMAIL=<email> PASSWORD=<password> node ./download-video.js <video-id>

const assert = require('assert')
const { niconico, Nicovideo } = require('..')

async function main(email, password, videoID) {
  assert(email, 'invalid email')
  assert(pasword, 'invalid pasword')
  assert(videoID, 'invalid videoID')

  try {
    const session = await niconico.login(email, password)
    const client = new Nicovideo(session)
    const exportedPath = await client.download(videoID, '.')
  } catch (err) {
    console.error(err)
  }

  console.log('Downloaded:', exportedPath)
}

main(process.env.EMAIL, process.env.PASSWORD, process.argv[2])
