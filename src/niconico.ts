import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'

axiosCookieJarSupport(axios)
axios.defaults.withCredentials = true

export async function login(
  email: string,
  password: string
): Promise<tough.CookieJar> {
  const requestURL =
    'https://account.nicovideo.jp/api/v1/login?site=niconico&next_url='
  const cookieJar = new tough.CookieJar()
  axios.defaults.jar = cookieJar
  await axios.post(requestURL, {
    mail_tel: email,
    password,
  })

  if (
    !cookieJar
      .getCookieStringSync('https://nicovideo.jp')
      .includes('user_session')
  ) {
    throw new Error('invalid credentials')
  }

  return cookieJar
}
