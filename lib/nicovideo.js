const {EventEmitter} = require('events');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const request = require('superagent');
const {parseString} = require('xml2js');
// const Promise = require('bluebird');
const jsdom = require('jsdom');

class Nicovideo extends EventEmitter {
	constructor(sessionKey) {
		super();
		this.sessionKey = sessionKey;
	}

	fetchVideoPage(videoID) {
		return new Promise((resolve, reject) => {
			console.log(this.sessionKey)
			request
				.get(`http://www.nicovideo.jp/watch/${videoID}`)
				.withCredentials()
				.set('Cookie', this.sessionKey)
				.set('Accept', 'text/html')
				.end((err, res) => {
					if (err) {
						return reject(err);
					}
					const document = jsdom.jsdom(res.text);
					const watchDOM = document.querySelector('#watchAPIDataContainer');
					const watchAPIData = JSON.parse(watchDOM.innerHTML);
					resolve(watchAPIData);
				});
		});
	}

	getFLV(videoID) {
		return new Promise((resolve, reject) => {
			const options = {
				url: `http://flapi.nicovideo.jp/api/getflv/${videoID}`
			};

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
			const options = {
				url: `http://ext.nicovideo.jp/api/getthumbinfo/${videoID}`
			};

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
				.then(flvinfo => {
					meta = Object.assign({}, meta, flvinfo);
					this.getThumbinfo(videoID);
				})
				.then(thumbinfo => {
					meta = Object.assign({}, meta, thumbinfo);
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
