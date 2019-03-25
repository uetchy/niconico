import assert from 'assert'
import { setup } from 'jest-playback'
import * as niconico from '../src/niconico'

const EMAIL = process.env.NICONICO_EMAIL
const PASSWORD = process.env.NICONICO_PASSWORD
assert(EMAIL, 'set NICONICO_EMAIL')
assert(PASSWORD, 'set NICONICO_PASSWORD')

setup(__dirname)

test('success to sign in', async () => {
  const session = await niconico.login(EMAIL, PASSWORD)

  const json = session
    .getCookiesSync('https://nicovideo.jp')
    .map((l) => l.toJSON())
    .map((c) => c.key) as string[]

  expect(json.includes('nicosid')).toBeTruthy()
  expect(json.includes('user_session')).toBeTruthy()
})

test('fail to sign in', async () => {
  await expect(niconico.login(EMAIL, 'invalidpassword')).rejects.toThrow()
})
