import test from 'ava'
import assert from 'assert'
import path from 'path'
import { niconico, Nicovideo } from '../dist'

const EMAIL = process.env.NICONICO_EMAIL
const PASSWORD = process.env.NICONICO_PASSWORD
assert(EMAIL, 'set NICONICO_EMAIL')
assert(PASSWORD, 'set NICONICO_PASSWORD')

const VIDEO_ID = 'sm28222588'

let client

test.before(async t => {
  const session = await niconico.login(EMAIL, PASSWORD)
  client = new Nicovideo(session)
})

test('get watch data containers', async t => {
  const data = await client.watch(VIDEO_ID)
  t.is(data.video.title, '【ゆめにっき】クリプト・オブ･ザ・モノクロダンサー')
})

test('fail when invalid videoID given', t => {
  return client
    .watch('sm99999999999')
    .then(data => t.fail(data))
    .catch(err => {
      t.pass(err)
    })
})

test('fail when credentials missing', async t => {
  try {
    const session = await niconico.login('', '')
    const data = await new Nicovideo(session).watch(VIDEO_ID)
    t.fail(data)
  } catch (err) {
    t.pass(err)
  }
})

test('getthumbinfo', async t => {
  try {
    const thumbinfo = await new Nicovideo().thumbinfo(VIDEO_ID)
    t.is(thumbinfo.watchURL, `https://www.nicovideo.jp/watch/${VIDEO_ID}`)
  } catch (err) {
    t.fail(err)
  }
})

test('invalid getthumbinfo', async t => {
  try {
    const thumbinfo = await new Nicovideo().thumbinfo('sm99999999999')
    t.fail(thumbinfo)
  } catch (err) {
    t.pass()
  }
})

test('fail to download video', async t => {
  try {
    const filePath = await client.download('sm99999999999', '.')
    t.fail(filepath)
  } catch (err) {
    t.pass()
  }
})

test('download video', async t => {
  const filePath = await client.download(VIDEO_ID, '.')
  t.is(
    filePath,
    path.resolve('./【ゆめにっき】クリプト・オブ･ザ・モノクロダンサー.mp4')
  )
  t.pass()
})
