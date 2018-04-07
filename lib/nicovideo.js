const { EventEmitter } = require('events')
const querystring = require('querystring')
const fs = require('fs')
const path = require('path')
const request = require('request-promise')
const xml = require('xml2js')
const { JSDOM } = require('jsdom')

class Nicovideo extends EventEmitter {
  constructor(cookieJar) {
    super()
    this.cookieJar = cookieJar || request.jar()
  }

  watch(videoID) {
    return new Promise(async (resolve, reject) => {
      try {
        const option = {
          jar: this.cookieJar,
        }
        const body = await request.get(`http://www.nicovideo.jp/watch/${videoID}`, option)
        const { document } = new JSDOM(body).window

        const data = JSON.parse(
          document.querySelector('#js-initial-watch-data').attributes['data-api-data'].textContent
        )

        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }

  thumbinfo(videoID) {
    return new Promise((resolve, reject) => {
      if (!videoID) {
        reject('videoID must be specified')
      }
      request.get(`http://ext.nicovideo.jp/api/getthumbinfo/${videoID}`, (err, res, body) => {
        if (err) {
          return reject(res.statusCode)
        }

        xml.parseString(body, (parseError, result) => {
          if (parseError) {
            return reject(parseError)
          }

          if (result.nicovideo_thumb_response.$.status === 'fail') {
            return reject(result.nicovideo_thumb_response.error[0].description[0])
          }

          const thumb = result.nicovideo_thumb_response.thumb[0]

          const thumbinfo = {
            videoID: thumb.video_id[0],
            title: thumb.title[0],
            description: thumb.description[0],
            watchURL: thumb.watch_url[0],
            movieType: thumb.movie_type[0],
          }

          resolve(thumbinfo)
        })
      })
    })
  }

  httpExport(uri, targetPath) {
    return new Promise(async (resolve, reject) => {
      try {
        const headRes = await request.head(uri, {
          resolveWithFullResponse: false,
          simple: false,
        })
        request(uri, { jar: this.cookieJar })
          .pipe(fs.createWriteStream(targetPath))
          .on('finish', () => resolve(targetPath))
      } catch (err) {
        reject(err)
      }
    })
  }

  download(videoID, targetPath) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.watch(videoID)
        const escapedTitle = data.video.title.replace(/\//g, '／')
        const filename = escapedTitle + '.' + data.video.movieType
        const filepath = path.resolve(path.join(targetPath, filename))
        const exportedPath = await this.httpExport(data.video.smileInfo.url, filepath)
        resolve(exportedPath)
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = Nicovideo
