async = require 'async'
fs = require 'fs'
path = require 'path'
querystring = require 'querystring'
request = require 'request'
{parseString} = require 'xml2js'
{EventEmitter} = require 'events'
Promise = require 'promise'
_ = require 'underscore'

request = request.defaults jar: true

do (definition = ->
  # CommonJS
  if typeof exports == 'object'
    module.exports = definition()
    # RequireJS
  else if typeof define == 'function' and define.amd
    define definition
    # <script>
  else
    Nicovideo = definition()
  return
) ->
  'use strict'

  class Nicovideo
    constructor: (options) ->
      @email = options.email
      @password = options.password
      @output = options.output
      return

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
          return
        return

    get_video: (video_id) ->
      new Promise (resolve, reject) ->
        options = url: 'http://www.nicovideo.jp/watch/' + video_id
        request.get options, (error, response, body) ->
          if error
            reject response.statusCode
            return
          console.log 'Video page accessing is success', response.statusCode
          resolve response.statusCode
          return
        return

    get_flv: (video_id) ->
      new Promise (resolve, reject) ->
        options = url: 'http://www.nicovideo.jp/api/getflv?v=' + video_id
        request.get options, (error, response, body) ->
          if error
            reject response.statusCode
            return
          console.log 'getflv', body
          flvinfo =
            thread_id: body.split('&')[0].split('=')[1]
            url: querystring.unescape(body.split('&')[2].split('=')[1])
          resolve flvinfo
          return
        return

    get_thumbinfo: (video_id) ->
      new Promise (resolve, reject) ->
        options = url: 'http://ext.nicovideo.jp/api/getthumbinfo/' + video_id
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
            return
          return
        return

    http_export: (uri, path) ->
      new Promise (resolve, reject) ->
        request.head uri, (err, res, body) ->
          req = request(uri).pipe(fs.createWriteStream(path))
          req.on 'finish', resolve
          return
        return

    download: (video_id) ->
      new Promise (resolve, reject) ->
        meta = {}
        self = this
        @sign_in().then((_status) ->
          self.get_video video_id
          return
        ).then((_status) ->
          self.get_flv video_id
          return
        ).then((_flvinfo) ->
          meta = _.extend(meta, _flvinfo)
          self.get_thumbinfo video_id
          return
        ).then((_thumbinfo) ->
          meta = _.extend(meta, _thumbinfo)
          escapedTitle = meta.title.replace(/\//g, '／')
          filename = '' + escapedTitle + '.' + meta.movie_type
          meta.filepath = path.resolve(path.join(self.output, filename))
          http_export meta.url, meta.filepath
          return
        ).then(->
          resolve meta.filepath
          return
        ).done()
        return

module.exports = Nicovideo
