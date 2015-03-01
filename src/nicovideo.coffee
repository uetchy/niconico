async          = require 'async'
fs             = require 'fs'
path           = require 'path'
querystring    = require 'querystring'
request        = require 'request'
{parseString}  = require 'xml2js'
{EventEmitter} = require 'events'
Promise        = require 'bluebird'
_              = require 'lodash'

request = request.defaults jar: true

class Nicovideo
  'use strict'

  constructor: (options) ->
    @email = options.email
    @password = options.password

  sign_in: ->
    new Promise (resolve, reject) ->
      options =
        url: 'https://secure.nicovideo.jp/secure/login?site=niconico'
        form:
          mail: Nicovideo.email
          password: Nicovideo.password
      request.post options, (error, response, body) ->
        if error
          reject response.statusCode
          return
        console.log 'Login success', response.statusCode
        resolve response.statusCode

  fetch_video_page: (video_id) ->
    new Promise (resolve, reject) ->
      options =
        url: 'http://www.nicovideo.jp/watch/' + video_id

      request.get options, (error, response, body) ->
        if error
          reject response.statusCode
          return

        console.log 'Video page accessing is success', response.statusCode

        resolve response.statusCode

  get_flv: (video_id) ->
    new Promise (resolve, reject) ->
      options =
        url: 'http://www.nicovideo.jp/api/getflv?v=' + video_id

      request.get options, (error, response, body) ->
        if error
          reject response.statusCode
          return

        console.log 'getflv', body
        flvinfo =
          thread_id: body.split('&')[0].split('=')[1]
          url: querystring.unescape(body.split('&')[2].split('=')[1])

        resolve flvinfo

  get_thumbinfo: (video_id) ->
    new Promise (resolve, reject) ->
      options =
        url: 'http://ext.nicovideo.jp/api/getthumbinfo/' + video_id

      request.get options, (error, response, body) ->
        if error
          reject response.statusCode
          return

        parseString body, (parseError, result) ->
          if parseError
            reject error
            return

          thumbinfo =
            video_id: result.nicovideo_thumb_response.thumb[0].video_id[0]
            title: result.nicovideo_thumb_response.thumb[0].title[0]
            description: result.nicovideo_thumb_response.thumb[0].description[0]
            watch_url: result.nicovideo_thumb_response.thumb[0].watch_url[0]
            movie_type: result.nicovideo_thumb_response.thumb[0].movie_type[0]

          resolve thumbinfo

  http_export: (uri, path) ->
    new Promise (resolve, reject) ->
      request.head uri, (err, res, body) ->
        req = request(uri).pipe(fs.createWriteStream(path))
        req.on 'finish', resolve

  download: (video_id) ->
    new Promise (resolve, reject) ->
      meta = {}
      self = this

      @sign_in().then((_status) ->
        self.fetch_video_page video_id
      ).then((_status) ->
        self.get_flv video_id
      ).then((_flvinfo) ->
        meta = _.extend(meta, _flvinfo)
        self.get_thumbinfo video_id
      ).then((_thumbinfo) ->
        meta = _.extend(meta, _thumbinfo)
        escapedTitle = meta.title.replace(/\//g, '／')
        filename = '' + escapedTitle + '.' + meta.movie_type
        meta.filepath = path.resolve(path.join(self.output, filename))
        http_export meta.url, meta.filepath
      ).then(->
        resolve meta.filepath
      ).done()

module.exports = Nicovideo
