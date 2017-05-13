import test from 'ava'

import { niconico, Nicovideo } from '..'

const EMAIL = process.env.EMAIL
const PASSWORD = process.env.PASSWORD
const VIDEO_ID = 'sm28222588'

test('get watch data containers', t => {
  return niconico
    .login(EMAIL, PASSWORD)
    .then(session => {
      return new Nicovideo(session).watch(VIDEO_ID)
    })
    .then(result => {
      // console.log('watchAPI:', result)
      t.is(result.watchAPI.videoDetail.title, '【ゆめにっき】クリプト・オブ･ザ・モノクロダンサー')
    })
    .catch(err => {
      console.log(err)
    })
})

test('getthumbinfo', t => {
  return new Nicovideo()
    .thumbinfo(VIDEO_ID)
    .then(thumbinfo => {
      // console.log('thumbinfo:', thumbinfo)
      t.is(thumbinfo.watchURL, `http://www.nicovideo.jp/watch/${VIDEO_ID}`)
    })
    .catch(err => {
      console.log(err)
    })
})

test('download videos', () => {
  return niconico
    .login(EMAIL, PASSWORD)
    .then(session => {
      return new Nicovideo(session).download(VIDEO_ID, '.')
    })
    .then(filePath => {
      console.log(filePath)
    })
    .catch(err => {
      console.log(err)
    })
})

test('should fail when can not logIn', t => {
  return niconico
    .login('', '')
    .then(() => new Nicovideo().watch(VIDEO_ID))
    .then(() => t.fail())
    .catch(() => t.pass())
})
