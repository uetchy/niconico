var EventEmitter, Nicovideo, async, fs, parseString, path, querystring, request;

async = require('async');

fs = require('fs');

path = require('path');

querystring = require('querystring');

request = require('request');

parseString = require('xml2js').parseString;

EventEmitter = require('events').EventEmitter;

request = request.defaults({
  jar: true
});

Nicovideo = function(options) {
  this.email = options.email;
  this.password = options.password;
  return this.folder = options.folder;
};

Nicovideo.prototype = {
  sign_in: function(callback) {
    var options;
    options = {
      url: "https://secure.nicovideo.jp/secure/login?site=niconico",
      form: {
        mail: this.email,
        password: this.password
      },
      secureProtocol: 'SSLv3_method'
    };
    return request.post(options, function(error, response, body) {
      return callback(null, response.statusCode);
    });
  },
  get_video: function(video_id, callback) {
    var options;
    options = {
      url: "http://www.nicovideo.jp/watch/" + video_id
    };
    return request.get(options, function(error, response, body) {
      return callback(null, response.statusCode);
    });
  },
  get_flv: function(video_id, callback) {
    var options;
    options = {
      url: "http://www.nicovideo.jp/api/getflv?v=" + video_id
    };
    return request.get(options, function(error, response, body) {
      var flvinfo;
      flvinfo = {
        thread_id: body.split("&")[0].split("=")[1],
        url: querystring.unescape(body.split("&")[2].split("=")[1])
      };
      return callback(null, response.statusCode, flvinfo);
    });
  },
  get_thumbinfo: function(video_id, callback) {
    var options;
    options = {
      url: "http://ext.nicovideo.jp/api/getthumbinfo/" + video_id
    };
    return request.get(options, function(error, response, body) {
      return parseString(body, function(err, result) {
        var thumbinfo;
        thumbinfo = {
          video_id: result.nicovideo_thumb_response.thumb[0].video_id[0],
          title: result.nicovideo_thumb_response.thumb[0].title[0],
          description: result.nicovideo_thumb_response.thumb[0].description[0],
          watch_url: result.nicovideo_thumb_response.thumb[0].watch_url[0],
          movie_type: result.nicovideo_thumb_response.thumb[0].movie_type[0]
        };
        return callback(null, response.statusCode, thumbinfo);
      });
    });
  },
  http_export: function(uri, path, callback) {
    return request.head(uri, function(err, res, body) {
      var req;
      req = request(uri).pipe(fs.createWriteStream(path));
      return req.on('finish', callback);
    });
  },
  download: function(video_id) {
    var ev, meta;
    meta = {};
    ev = new EventEmitter;
    return async.waterfall([
      function(callback) {
        return sign_in(this.email, this.password, callback);
      }, function(_status, callback) {
        ev.emit('signed', _status);
        return get_video(video_id, callback);
      }, function(_status, callback) {
        return get_flv(video_id, callback);
      }, function(_status, _flvinfo, callback) {
        meta.update(_flvinfo);
        return get_thumbinfo(video_id, callback);
      }, function(_status, _thumbinfo, callback) {
        var escapedTitle, filename;
        meta.update(_thumbinfo);
        ev.emit('fetched', _status, meta);
        escapedTitle = meta.title.replace(/\//g, "／");
        filename = "" + escapedTitle + "." + meta.movie_type;
        meta.filepath = path.resolve(path.join(this.folder, filename));
        return http_export(meta.url, meta.filepath, callback);
      }, function(callback) {
        return ev.emit('exported', meta.filepath);
      }
    ]);
  }
};

module.exports = Nicovideo;
