const { EventEmitter } = require('events')
const querystring = require('querystring')
const fs = require('fs')
const path = require('path')
const request = require('request')
const xml = require('xml2js')
const { JSDOM } = require('jsdom')

class Nicovideo extends EventEmitter {
  constructor(cookieJar) {
    super()
    this.cookieJar = cookieJar || request.jar()
  }

  watch(videoID) {
    return new Promise((resolve, reject) => {
      request.get(
        `http://www.nicovideo.jp/watch/${videoID}`,
        {
          jar: this.cookieJar
        },
        (err, res, body) => {
          /* istanbul ignore if */
          if (err) {
            return reject(err)
          }
          const { document } = new JSDOM(body).window
          const dataContainerIDs = ['watchAPI', 'wall', 'playlist', 'config']

          const data = dataContainerIDs.reduce((result, id) => {
            const dom = document.querySelector(`#${id}DataContainer`)

            if (dom) {
              result[id] = JSON.parse(dom.innerHTML)
              return result
            }
            return null
          }, {})

          if (data === null) {
            return reject(new Error('Error: invalid videoID given'))
          }

          data.watchAPI.flashvars.flvInfo = querystring
            .unescape(data.watchAPI.flashvars.flvInfo)
            .split('&')
            .reduce((result, line) => {
              const [k, v] = line.split('=')
              result[k] = querystring.unescape(v)
              return result
            }, {})

          return resolve(data)
        }
      )
    })
  }

  thumbinfo(videoID) {
    return new Promise((resolve, reject) => {
      request.get(
        `http://ext.nicovideo.jp/api/getthumbinfo/${videoID}`,
        (err, res, body) => {
          /* istanbul ignore if */
          if (err) {
            return reject(res.statusCode)
          }

          xml.parseString(body, (parseError, result) => {
            /* istanbul ignore if  */
            if (parseError) {
              return reject(err)
            }

            if (result.nicovideo_thumb_response.$.status === 'fail') {
              return reject(
                result.nicovideo_thumb_response.error[0].description[0]
              )
            }

            const thumb = result.nicovideo_thumb_response.thumb[0]

            const thumbinfo = {
              videoID: thumb.video_id[0],
              title: thumb.title[0],
              description: thumb.description[0],
              watchURL: thumb.watch_url[0],
              movieType: thumb.movie_type[0]
            }

            resolve(thumbinfo)
          })
        }
      )
    })
  }

  httpExport(uri, targetPath) {
    return new Promise((resolve, reject) => {
      request.head(uri, err => {
        /* istanbul ignore if  */
        if (err) {
          return reject(err)
        }
        request(uri, { jar: this.cookieJar })
          .pipe(fs.createWriteStream(targetPath))
          .on('finish', () => {
            return resolve(targetPath)
          })
      })
    })
  }

  download(videoID, targetPath) {
    return new Promise((resolve, reject) => {
      return this.watch(videoID)
        .then(data => {
          const { watchAPI } = data
          const escapedTitle = watchAPI.videoDetail.title.replace(/\//g, '／')
          const filename = escapedTitle + '.' + watchAPI.flashvars.movie_type
          const filepath = path.resolve(path.join(targetPath, filename))
          return this.httpExport(watchAPI.flashvars.flvInfo.url, filepath)
        })
        .then(filepath => resolve(filepath))
        .catch(err => reject(err))
    })
  }
}

module.exports = Nicovideo
