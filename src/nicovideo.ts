import { EventEmitter } from 'events'
import { createWriteStream } from 'fs'
import path from 'path'
import { get, post, head } from 'request-promise'
import request from 'request'
import { parseString, convertableToString } from 'xml2js'
import { JSDOM } from 'jsdom'
import { promisify } from 'util'

import { WatchData, Thumbinfo } from 'nicovideo'

export default class Nicovideo extends EventEmitter {
  cookieJar: request.CookieJar

  constructor(cookieJar: request.CookieJar) {
    super()
    this.cookieJar = cookieJar || request.jar()
  }

  async watch(videoID: string): Promise<WatchData> {
    try {
      const body = await get(`https://www.nicovideo.jp/watch/${videoID}`, {
        jar: this.cookieJar,
      })
      const {
        window: { document },
      } = new JSDOM(body)

      const data = <WatchData>(
        JSON.parse(
          document
            .querySelector('#js-initial-watch-data')
            .getAttribute('data-api-data')
        )
      )

      return data
    } catch (err) {
      throw new Error(err)
    }
  }

  async thumbinfo(videoID: string): Promise<Thumbinfo> {
    if (!videoID) {
      throw new Error('videoID must be specified')
    }

    try {
      const body = await get(
        `https://ext.nicovideo.jp/api/getthumbinfo/${videoID}`
      )
      const result = <any>(
        await promisify<convertableToString>(parseString)(body)
      )
      if (result.nicovideo_thumb_response.$.status === 'fail') {
        throw new Error(result.nicovideo_thumb_response.error[0].description[0])
      }

      const thumb = result.nicovideo_thumb_response.thumb[0]
      const thumbinfo = <Thumbinfo>{
        videoID: thumb.video_id[0],
        title: thumb.title[0],
        description: thumb.description[0],
        watchURL: thumb.watch_url[0],
        movieType: thumb.movie_type[0],
      }
      return thumbinfo
    } catch (err) {
      throw new Error(err)
    }
  }

  async httpExport(uri: string, targetPath: string): Promise<string> {
    try {
      await head(uri, {
        resolveWithFullResponse: false,
        simple: false,
      })
      const req = request(uri, { jar: this.cookieJar }).pipe(
        createWriteStream(targetPath)
      )
      await new Promise(resolve => req.on('finish', resolve))
      return targetPath
    } catch (err) {
      throw new Error(err)
    }
  }

  async download(videoID: string, targetPath: string): Promise<string> {
    try {
      const data = await this.watch(videoID)
      const escapedTitle: string = data.video.title.replace(/\//g, '／')
      const filename = escapedTitle + '.' + data.video.movieType
      const filepath = path.resolve(path.join(targetPath, filename))
      const exportedPath = await this.httpExport(
        data.video.smileInfo.url,
        filepath
      )
      return exportedPath
    } catch (err) {
      throw new Error(err)
    }
  }
}
