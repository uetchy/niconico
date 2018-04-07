const request = require('request-promise')

function login(email, password) {
  return new Promise(async (resolve, reject) => {
    const requestURL = 'https://account.nicovideo.jp/api/v1/login?site=niconico&next_url='
    const jar = request.jar()
    try {
      const res = await request.post(requestURL, {
        jar: jar,
        form: {
          mail_tel: email, // eslint-disable-line camelcase
          password: password,
        },
        simple: false,
        resolveWithFullResponse: true,
      })

      if (!jar.getCookieString('http://nicovideo.jp').includes('user_session')) {
        return reject('invalid credentials')
      }

      return resolve(jar)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  login,
}
