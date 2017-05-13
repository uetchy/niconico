const request = require('request')

function login(email, password) {
  const requestURL =
    'https://account.nicovideo.jp/api/v1/login?site=niconico&next_url='
  return new Promise((resolve, reject) => {
    const jar = request.jar()
    request.post(
      requestURL,
      {
        jar: jar,
        form: {
          mail_tel: email, // eslint-disable-line camelcase
          password: password
        }
      },
      (err, res) => {
        if (err) {
          return reject(res.statusCode)
        }
        return resolve(jar)
      }
    )
  })
}

module.exports = {
  login
}
