import test from 'ava'
import assert from 'assert'
import { niconico } from '../lib'

const EMAIL = process.env.NICONICO_EMAIL
const PASSWORD = process.env.NICONICO_PASSWORD
assert(EMAIL, 'set NICONICO_EMAIL')
assert(PASSWORD, 'set NICONICO_PASSWORD')

test('success to sign in', async t => {
  const session = await niconico.login(EMAIL, PASSWORD)

  const json = session
    .getCookies('https://nicovideo.jp')
    .map(l => l.toJSON())
    .map(c => c.key)

  t.true(json.includes('nicosid'))
  t.true(json.includes('user_session'))
})

test('fail to sign in', async t => {
  try {
    const session = await niconico.login(EMAIL, 'invalidpassword')
    t.fail(session)
  } catch (err) {
    t.pass()
  }
})
