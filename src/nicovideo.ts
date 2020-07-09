import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { EventEmitter } from 'events'
import filenamify from 'filenamify'
import { createWriteStream } from 'fs'
import { JSDOM } from 'jsdom'
import { join, resolve } from 'path'
import { Readable } from 'stream'
import tough from 'tough-cookie'
import { promisify } from 'util'
import { convertableToString, parseString } from 'xml2js'
import { IThumbinfo, IWatchData } from './interfaces'

export default class Nicovideo extends EventEmitter {
  private client: AxiosInstance

  constructor(private cookieJar?: tough.CookieJar) {
    super()
    this.cookieJar = cookieJar || new tough.CookieJar()
    this.client = axios.create()
    axiosCookieJarSupport(this.client)
    this.client.defaults.withCredentials = true
    this.client.defaults.jar = this.cookieJar
  }

  public async watch(videoID: string): Promise<IWatchData> {
    const response = await this.client.get(
      `https://www.nicovideo.jp/watch/${videoID}`
    )
    const { document } = new JSDOM(response.data).window

    const data = JSON.parse(
      document
        .querySelector('#js-initial-watch-data')
        .getAttribute('data-api-data')
    ) as IWatchData

    return data
  }

  public async thumbinfo(videoID: string): Promise<IThumbinfo> {
    if (!videoID) {
      throw new Error('videoID must be specified')
    }

    const response = await this.client.get(
      `https://ext.nicovideo.jp/api/getthumbinfo/${videoID}`,
      { responseType: 'text' }
    )
    const result = (await promisify<convertableToString>(parseString)(
      response.data
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
  }

  public async httpExport(uri: string, targetPath: string): Promise<string> {
    await this.client.head(uri)
    const response = await this.client.get(uri, { responseType: 'stream' })
    const req = response.data.pipe(createWriteStream(targetPath))
    await new Promise((resolve) => req.on('finish', resolve))
    return targetPath
  }

  public async stream(videoID: string): Promise<Readable> {
    const data = await this.watch(videoID)
    const uri = data.video.smileInfo.url
    await this.client.head(uri)
    const response = await this.client.get(uri, { responseType: 'stream' })
    return response.data
  }

  public async download(videoID: string, targetPath: string): Promise<string> {
    const data = await this.watch(videoID)
    const fileName = filenamify(data.video.title) + '.' + data.video.movieType
    const filePath = resolve(join(targetPath, fileName))
    const exportedPath = await this.httpExport(
      data.video.smileInfo.url,
      filePath
    )
    return exportedPath
  }
}
