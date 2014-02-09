async = require('async')
fs = require('fs')
path = require('path')
querystring = require('querystring')
request = require('request')
parseString = require('xml2js').parseString
EventEmitter = require('events').EventEmitter

request = request.defaults({jar: true})

# Module methods

Nicovideo = (options) ->
  this.email = options.email
  this.password = options.password
  this.folder = options.folder

Nicovideo.prototype =
  sign_in: (callback) ->
    options =
      url: "https://secure.nicovideo.jp/secure/login?site=niconico"
      form: { mail: this.email, password: this.password }
      secureProtocol: 'SSLv3_method'

    request.post options, (error, response, body) ->
      callback(null, response.statusCode)

  get_video: (video_id, callback) ->
    options =
      url: "http://www.nicovideo.jp/watch/#{video_id}"
    request.get options, (error, response, body) ->
      callback(null, response.statusCode)

  get_flv: (video_id, callback) ->
    options =
      url: "http://www.nicovideo.jp/api/getflv?v=#{video_id}"
    request.get options, (error, response, body) ->
      flvinfo =
        thread_id: body.split("&")[0].split("=")[1]
        url: querystring.unescape(body.split("&")[2].split("=")[1])

      callback(null, response.statusCode, flvinfo)

  get_thumbinfo: (video_id, callback) ->
    options =
      url: "http://ext.nicovideo.jp/api/getthumbinfo/#{video_id}"
    request.get options, (error, response, body) ->
      parseString body, (err, result) ->
        thumbinfo =
          video_id: result.nicovideo_thumb_response.thumb[0].video_id[0]
          title: result.nicovideo_thumb_response.thumb[0].title[0]
          description: result.nicovideo_thumb_response.thumb[0].description[0]
          watch_url: result.nicovideo_thumb_response.thumb[0].watch_url[0]
          movie_type: result.nicovideo_thumb_response.thumb[0].movie_type[0]

        callback(null, response.statusCode, thumbinfo)

  http_export: (uri, path, callback) ->
    request.head uri, (err, res, body) ->
      req = request(uri).pipe(fs.createWriteStream(path))
      req.on('finish', callback)

# Sequence methods

  download: (video_id) ->
    meta = {}
    ev = new EventEmitter

    async.waterfall([
      (callback) ->
        sign_in(this.email, this.password, callback)

      (_status, callback) ->
        ev.emit('signed', _status)
        get_video(video_id, callback)

      (_status, callback) ->
        get_flv(video_id, callback)
      
      (_status, _flvinfo, callback) ->
        meta.update _flvinfo
        get_thumbinfo(video_id, callback)
      
      (_status, _thumbinfo, callback) ->
        meta.update _thumbinfo
        ev.emit('fetched', _status, meta)

        escapedTitle = meta.title.replace(/\//g, "／")

        filename = "#{escapedTitle}.#{meta.movie_type}"
        meta.filepath = path.resolve(path.join(this.folder, filename))
        http_export(meta.url, meta.filepath, callback)

      (callback) ->
        ev.emit('exported', meta.filepath)
    ])

module.exports = Nicovideo