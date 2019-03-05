import { EventEmitter } from 'events'
import filenamify from 'filenamify'
import { createWriteStream } from 'fs'
import { JSDOM } from 'jsdom'
import { join, resolve } from 'path'
import request from 'request'
import { get, head } from 'request-promise'
import { promisify } from 'util'
import { convertableToString, parseString } from 'xml2js'

import { IThumbinfo, IWatchData } from './interfaces'

export default class Nicovideo extends EventEmitter {
  private cookieJar: request.CookieJar

  constructor(cookieJar: request.CookieJar) {
    super()
    this.cookieJar = cookieJar || request.jar()
  }

  public async watch(videoID: string): Promise<IWatchData> {
    try {
      const body = await get(`https://www.nicovideo.jp/watch/${videoID}`, {
        jar: this.cookieJar,
      })
      const { document } = new JSDOM(body).window

      const data = JSON.parse(
        document
          .querySelector('#js-initial-watch-data')
          .getAttribute('data-api-data')
      ) as IWatchData

      return data
    } catch (err) {
      throw new Error(err)
    }
  }

  public async thumbinfo(videoID: string): Promise<IThumbinfo> {
    if (!videoID) {
      throw new Error('videoID must be specified')
    }

    try {
      const body = await get(
        `https://ext.nicovideo.jp/api/getthumbinfo/${videoID}`
      )
      const result = (await promisify<convertableToString>(parseString)(
        body
      )) as any
      if (result.nicovideo_thumb_response.$.status === 'fail') {
        throw new Error(result.nicovideo_thumb_response.error[0].description[0])
      }

      const thumb = result.nicovideo_thumb_response.thumb[0]
      const thumbinfo = {
        description: thumb.description[0],
        movieType: thumb.movie_type[0],
        title: thumb.title[0],
        videoID: thumb.video_id[0],
        watchURL: thumb.watch_url[0],
      } as IThumbinfo
      return thumbinfo
    } catch (err) {
      throw new Error(err)
    }
  }

  public async httpExport(uri: string, targetPath: string): Promise<string> {
    try {
      await head(uri, {
        resolveWithFullResponse: false,
        simple: false,
      })
      const req = request(uri, { jar: this.cookieJar }).pipe(
        createWriteStream(targetPath)
      )
      await new Promise((resolve) => req.on('finish', resolve))
      return targetPath
    } catch (err) {
      throw new Error(err)
    }
  }

  public async download(videoID: string, targetPath: string): Promise<string> {
    try {
      const data = await this.watch(videoID)
      const fileName = filenamify(data.video.title) + '.' + data.video.movieType
      const filePath = resolve(join(targetPath, fileName))
      const exportedPath = await this.httpExport(
        data.video.smileInfo.url,
        filePath
      )
      return exportedPath
    } catch (err) {
      throw new Error(err)
    }
  }
}
