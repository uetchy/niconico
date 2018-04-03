const request = require('request')

function login(email, password) {
  return new Promise((resolve, reject) => {
    const requestURL = 'https://account.nicovideo.jp/api/v1/login?site=niconico&next_url='
    const jar = request.jar()
    request.post(
      requestURL,
      {
        jar: jar,
        form: {
          mail_tel: email, // eslint-disable-line camelcase
          password: password,
        },
      },
      (err, res) => {
        /* istanbul ignore if */
        if (err) {
          return reject(res.statusCode)
        }

        if (!jar.getCookieString('http://nicovideo.jp').includes('user_session')) {
          return reject('invalid credentials')
        }

        return resolve(jar)
      }
    )
  })
}

module.exports = {
  login,
}
