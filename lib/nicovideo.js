const {EventEmitter} = require('events');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
let request = require('request');
const {parseString} = require('xml2js');
const Promise = require('bluebird');

class Nicovideo extends EventEmitter {
	constructor(options) {
		super();
		this.email = options.email;
		this.password = options.password;

		this.request = request.defaults({jar: true});
	}

	signIn() {
		return new Promise((resolve, reject) => {
			const options = {
				url: 'https://secure.nicovideo.jp/secure/login?site=niconico',
				form: {
					mail: Nicovideo.email,
					password: Nicovideo.password
				}
			};
			this.request.post(options, (err, res) => {
				if (err) {
					return reject(res.statusCode);
				}
				console.log('Login success', res.statusCode);
				resolve(res.statusCode);
			});
		});
	}

	fetchVideoPage(videoID) {
		return new Promise((resolve, reject) => {
			const options = {url: 'http://www.nicovideo.jp/watch/' + videoID};

			this.request.get(options, (err, res) => {
				if (err) {
					return reject(err);
				}
				resolve(res);
			});
		});
	}

	getFLV(videoID) {
		return new Promise((resolve, reject) => {
			const options = {url: 'http://www.nicovideo.jp/api/getflv?v=' + videoID};

			this.request.get(options, (err, res, body) => {
				if (err) {
					return reject(res.statusCode);
				}

				console.log('getflv', body);
				const parsedFlvinfo = body
					.split('&')
					.reduce((prev, curr) => {
						prev[curr.split('=')[0]] = querystring.unescape(curr.split('=')[1]);
						return prev;
					}, {});
				const flvinfo = {
					threadID: parsedFlvinfo.thread_id,
					url: parsedFlvinfo.url
				};

				resolve(flvinfo);
			});
		});
	}

	getThumbinfo(videoID) {
		return new Promise((resolve, reject) => {
			const options = {url: 'http://ext.nicovideo.jp/api/getthumbinfo/' + videoID};

			request.get(options, (err, res, body) => {
				if (err) {
					return reject(res.statusCode);
				}

				parseString(body, (parseError, result) => {
					if (parseError) {
						return reject(err);
					}

					const thumbinfo = {
						videoID: result.nicovideo_thumb_response.thumb[0].video_id[0],
						title: result.nicovideo_thumb_response.thumb[0].title[0],
						description: result.nicovideo_thumb_response.thumb[0].description[0],
						watchURL: result.nicovideo_thumb_response.thumb[0].watch_url[0],
						movieType: result.nicovideo_thumb_response.thumb[0].movie_type[0]
					};

					resolve(thumbinfo);
				});
			});
		});
	}

	httpExport(uri, path) {
		return new Promise((resolve, reject) => {
			request.head(uri, err => {
				if (err) {
					return reject(err);
				}
				const req = request(uri).pipe(fs.createWriteStream(path));
				req.on('finish', resolve);
			});
		});
	}

	download(videoID) {
		return new Promise((resolve, reject) => {
			let meta = {};

			this.signIn()
				.then(() => {
					this.fetchVideoPage(videoID);
				})
				.then(() => {
					this.getFLV(videoID);
				})
				.then(_flvinfo => {
					meta = Object.assign({}, meta, _flvinfo);
					this.getThumbinfo(videoID);
				})
				.then(_thumbinfo => {
					meta = Object.assign({}, meta, _thumbinfo);
					const escapedTitle = meta.title.replace(/\//g, '／');
					const filename = escapedTitle + '.' + meta.movie_type;
					meta.filepath = path.resolve(path.join(this.output, filename));
					this.httpExport(meta.url, meta.filepath);
				})
				.then(() => {
					resolve(meta.filepath);
				})
				.catch(err => {
					reject(err);
				})
				.done();
		});
	}
}

module.exports = Nicovideo;
