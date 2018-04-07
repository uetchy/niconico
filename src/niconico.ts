import request from 'request'
import { post } from 'request-promise'

export function login(email: string, password: string) {
  return new Promise<request.CookieJar>(async (resolve, reject) => {
    const requestURL = 'https://account.nicovideo.jp/api/v1/login?site=niconico&next_url='
    const jar = request.jar()
    try {
      const res = await post(requestURL, {
        jar: jar,
        form: {
          mail_tel: email,
          password: password,
        },
        simple: false,
        resolveWithFullResponse: true,
      })

      if (!jar.getCookieString('http://nicovideo.jp').includes('user_session')) {
        return reject('invalid credentials')
      }

      resolve(jar)
    } catch (err) {
      reject(err)
    }
  })
}
