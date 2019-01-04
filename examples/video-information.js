#!/usr/bin/env node
// example: $ node ./video-information.js <video-id>

const assert = require('assert')
const { Nicovideo } = require('..')

async function main(videoID) {
  assert(videoID, 'no video id given')
  const client = new Nicovideo()

  try {
    const thumbinfo = await client.thumbinfo(videoID)
  } catch (err) {
    console.error(err)
  }

  console.log(JSON.stringify(thumbinfo, null, 2))
}

main(process.argv[2])
