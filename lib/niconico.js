const request = require('request');

function getSessionCookie(email, password) {
	const requestURL = 'https://account.nicovideo.jp/api/v1/login?site=niconico';
	return new Promise((resolve, reject) => {
		let jar = request.jar();
		request.post(requestURL,
			{
				jar: jar,
				form: {
					mail_tel: email, // eslint-disable-line camelcase
					password: password
				}
			}, (err, res) => {
				if (err) {
					return reject(res.statusCode);
				}
				return resolve(jar);
			});
	});
}

module.exports = {
	getSessionCookie
};

