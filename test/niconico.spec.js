import test from 'ava'

import { niconico } from '..'

test.beforeEach(t => {
  t.context.videoID = process.env.VIDEO_ID || 'sm28222588'
})

test('success to sign in', async t => {
  const session = await niconico.login(process.env.EMAIL, process.env.PASSWORD)
  const json = session
    .getCookies('http://nicovideo.jp')
    .map(l => l.toJSON())
    .map(c => c.key)

  t.true(json.includes('nicosid'))
  t.true(json.includes('user_session'))
})

test('fail to sign in', async t => {
  try {
    const session = await niconico.login(process.env.EMAIL, 'invalidpassword')
    t.fail(session)
  } catch (err) {
    t.pass()
  }
})
