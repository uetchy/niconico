#!/usr/bin/env node
// example: $ EMAIL=<email> PASSWORD=<password> node ./download-video.js <video-id>

const assert = require('assert')
const { niconico, Nicovideo } = require('..')

async function main(email, password, videoID) {
  try {
    assert(email, 'invalid email')
    assert(pasword, 'invalid pasword')
    assert(videoID, 'invalid videoID')
    const session = niconico.login(email, password)
    const filepath = new Nicovideo(session).download(videoID, '.')
  } catch (err) {
    console.error(err)
  }

  console.log('Downloaded:', filePath)
}

main(process.env.EMAIL, process.env.PASSWORD, process.argv[2])
