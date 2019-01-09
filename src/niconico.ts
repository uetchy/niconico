import request from 'request'
import { post } from 'request-promise'

export async function login(
  email: string,
  password: string
): Promise<request.CookieJar> {
  const requestURL =
    'https://account.nicovideo.jp/api/v1/login?site=niconico&next_url='
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

    if (!jar.getCookieString('https://nicovideo.jp').includes('user_session')) {
      throw new Error('invalid credentials')
    }

    return jar
  } catch (err) {
    throw new Error(err)
  }
}
