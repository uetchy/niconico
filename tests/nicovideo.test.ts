import assert from 'assert'
import { setup } from 'jest-playback'
import path from 'path'
import * as niconico from '../src/niconico'
import Nicovideo from '../src/nicovideo'

const EMAIL = process.env.NICONICO_EMAIL
const PASSWORD = process.env.NICONICO_PASSWORD
assert(EMAIL, 'set NICONICO_EMAIL')
assert(PASSWORD, 'set NICONICO_PASSWORD')
const VIDEO_ID = 'sm28222588'

setup(__dirname)

let client: Nicovideo

beforeEach(async () => {
  const session = await niconico.login(EMAIL, PASSWORD)
  client = new Nicovideo(session)
})

test('get watch data containers', async () => {
  const data = await client.watch(VIDEO_ID)
  expect(data.video.title).toEqual(
    '【ゆめにっき】クリプト・オブ･ザ・モノクロダンサー'
  )
})

test('fail when invalid videoID given', async () => {
  await expect(client.watch('sm99999999999')).rejects.toThrow()
})

test('getthumbinfo', async () => {
  const thumbinfo = await new Nicovideo().thumbinfo(VIDEO_ID)
  expect(thumbinfo.watchURL).toEqual(
    `https://www.nicovideo.jp/watch/${VIDEO_ID}`
  )
})

test('invalid getthumbinfo', async () => {
  await expect(new Nicovideo().thumbinfo('sm99999999999')).rejects.toThrow()
})

test('fail to download video', async () => {
  await expect(client.download('sm99999999999', '.')).rejects.toThrow()
})

test('download video', async () => {
  const filePath = await client.download(VIDEO_ID, '.')
  expect(filePath).toEqual(
    path.resolve('./【ゆめにっき】クリプト・オブ･ザ・モノクロダンサー.mp4')
  )
}, 60000)
