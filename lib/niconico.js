const request = require('superagent');

function getSessionKey(email, password) {
	return new Promise((resolve, reject) => {
		request
			.post('https://account.nicovideo.jp/api/v1/login?site=niconico')
			.query({
				mail_tel: email, // eslint-disable-line camelcase
				password: password
			})
			.end((err, res) => {
				if (err) {
					return reject(res.statusCode);
				}
				resolve(res.header['set-cookie'].join(', '));
			});
	});
}

module.exports = {
	getSessionKey
};

