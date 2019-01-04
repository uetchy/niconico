import { EventEmitter } from 'events'
import querystring from 'querystring'
import { createWriteStream } from 'fs'
import path from 'path'
import { get, post, head } from 'request-promise'
import request from 'request'
import { parseString } from 'xml2js'
import { JSDOM } from 'jsdom'

import { WatchData, Thumbinfo } from 'nicovideo'

export default class Nicovideo extends EventEmitter {
  cookieJar: request.CookieJar

  constructor(cookieJar: request.CookieJar) {
    super()
    this.cookieJar = cookieJar || request.jar()
  }

  watch(videoID: string) {
    return new Promise<WatchData>(async (resolve, reject) => {
      try {
        const body = await get(`https://www.nicovideo.jp/watch/${videoID}`, {
          jar: this.cookieJar,
        })
        const { document } = new JSDOM(body).window

        const data = <WatchData>(
          JSON.parse(
            document
              .querySelector('#js-initial-watch-data')
              .getAttribute('data-api-data')
          )
        )

        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }

  thumbinfo(videoID: string) {
    return new Promise<Thumbinfo>(async (resolve, reject) => {
      if (!videoID) {
        reject('videoID must be specified')
      }
      try {
        const body = await get(
          `https://ext.nicovideo.jp/api/getthumbinfo/${videoID}`
        )
        parseString(body, (parseError, result) => {
          if (parseError) {
            return reject(parseError)
          }

          if (result.nicovideo_thumb_response.$.status === 'fail') {
            return reject(
              result.nicovideo_thumb_response.error[0].description[0]
            )
          }

          const thumb = result.nicovideo_thumb_response.thumb[0]
          const thumbinfo = <Thumbinfo>{
            videoID: thumb.video_id[0],
            title: thumb.title[0],
            description: thumb.description[0],
            watchURL: thumb.watch_url[0],
            movieType: thumb.movie_type[0],
          }
          resolve(thumbinfo)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  httpExport(uri: string, targetPath: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const headRes = await head(uri, {
          resolveWithFullResponse: false,
          simple: false,
        })
        request(uri, { jar: this.cookieJar })
          .pipe(createWriteStream(targetPath))
          .on('finish', () => resolve(targetPath))
      } catch (err) {
        reject(err)
      }
    })
  }

  download(videoID: string, targetPath: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const data = await this.watch(videoID)
        const escapedTitle: string = data.video.title.replace(/\//g, '／')
        const filename = escapedTitle + '.' + data.video.movieType
        const filepath = path.resolve(path.join(targetPath, filename))
        const exportedPath = await this.httpExport(
          data.video.smileInfo.url,
          filepath
        )
        resolve(exportedPath)
      } catch (err) {
        reject(err)
      }
    })
  }
}
