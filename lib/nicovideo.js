const {EventEmitter} = require('events');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const request = require('request');
const {parseString} = require('xml2js');
const jsdom = require('jsdom');

class Nicovideo extends EventEmitter {
	constructor(sessionCookie) {
		super();
		this.sessionCookie = sessionCookie || request.jar();
	}

	getWatchData(videoID) {
		return new Promise((resolve, reject) => {
			request
				.get(`http://www.nicovideo.jp/watch/${videoID}`, {
					jar: this.sessionCookie
				}, (err, res, body) => {
					if (err) {
						return reject(err);
					}
					const document = jsdom.jsdom(body);
					const watchDOM = document.querySelector('#watchAPIDataContainer');
					let watchData = JSON.parse(watchDOM.innerHTML);
					watchData.flashvars.flvInfo = querystring.unescape(watchData.flashvars.flvInfo)
						.split('&')
						.reduce((prev, curr) => {
							prev[curr.split('=')[0]] = querystring.unescape(curr.split('=')[1]);
							return prev;
						}, {});
					return resolve(watchData);
				});
		});
	}

	getFLV(videoID) {
		return new Promise((resolve, reject) => {
			request.get(`http://flapi.nicovideo.jp/api/getflv/${videoID}`, {
				jar: this.sessionCookie
			},
			(err, res, body) => {
				if (err) {
					return reject(res.statusCode);
				}

				const parsedFlvinfo = querystring.unescape(body)
					.split('&')
					.reduce((prev, curr) => {
						prev[curr.split('=')[0]] = curr.split('=')[1];
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
			request.get(`http://ext.nicovideo.jp/api/getthumbinfo/${videoID}`,
				(err, res, body) => {
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

	httpExport(uri, targetPath) {
		return new Promise((resolve, reject) => {
			request.head(uri, err => {
				if (err) {
					return reject(err);
				}
				const req = request(uri, {jar: this.sessionCookie})
					.pipe(fs.createWriteStream(targetPath));
				req.on('finish', () => {
					resolve(targetPath);
				});
			});
		});
	}

	download(videoID, targetPath) {
		return new Promise((resolve, reject) => {
			return this.getWatchData(videoID)
				.then(watchData => {
					const escapedTitle = watchData.videoDetail.title.replace(/\//g, '／');
					const filename = escapedTitle + '.' + watchData.flashvars.movie_type;
					const filepath = path.resolve(path.join(targetPath, filename));
					return this.httpExport(watchData.flashvars.flvInfo.url, filepath);
				})
				.then(filepath => {
					resolve(filepath);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}

module.exports = Nicovideo;
