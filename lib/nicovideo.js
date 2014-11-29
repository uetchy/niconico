var async = require('async');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var request = require('request');
var parseString = require('xml2js').parseString;
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

request = request.defaults({jar: true});

(function(definition){
  // Change export way
  // CommonJS
  if (typeof exports === "object") {
    module.exports = definition();

  // RequireJS
  } else if (typeof define === "function" && define.amd) {
    define(definition);

    // <script>
  } else {
    Nicovideo = definition();
  }

})(function(){ // Real declaration
  'use strict';

  var Nicovideo = function(options) {
    this.email = options.email;
    this.password = options.password;
    this.output = options.output;
  };

  Nicovideo.prototype = {
    sign_in: function(callback) {
      var options = {
        url: "https://secure.nicovideo.jp/secure/login?site=niconico",
        form: {
          mail: this.email,
          password: this.password
        }
      };

      request.post(options, function(error, response, body) {
        callback(null, response.statusCode);
      });
    },
    get_video: function(video_id, callback) {
      var options = {
        url: "http://www.nicovideo.jp/watch/" + video_id
      };

      request.get(options, function(error, response, body) {
        callback(null, response.statusCode);
      });
    },
    get_flv: function(video_id, callback) {
      var options = {
        url: "http://www.nicovideo.jp/api/getflv?v=" + video_id
      };

      request.get(options, function(error, response, body) {
        var flvinfo = {
          thread_id: body.split("&")[0].split("=")[1],
          url: querystring.unescape(body.split("&")[2].split("=")[1])
        };
        callback(null, response.statusCode, flvinfo);
      });
    },
    get_thumbinfo: function(video_id, callback) {
      var options = {
        url: "http://ext.nicovideo.jp/api/getthumbinfo/" + video_id
      };

      request.get(options, function(error, response, body) {
        parseString(body, function(err, result) {
          var thumbinfo = {
            video_id: result.nicovideo_thumb_response.thumb[0].video_id[0],
            title: result.nicovideo_thumb_response.thumb[0].title[0],
            description: result.nicovideo_thumb_response.thumb[0].description[0],
            watch_url: result.nicovideo_thumb_response.thumb[0].watch_url[0],
            movie_type: result.nicovideo_thumb_response.thumb[0].movie_type[0]
          };
          callback(null, response.statusCode, thumbinfo);
        });
      });
    },
    http_export: function(uri, path, callback) {
      request.head(uri, function(err, res, body) {
        var req = request(uri).pipe(fs.createWriteStream(path));
        req.on('finish', callback);
      });
    },
    download: function(video_id) {
      var meta = {};
      var ev = new EventEmitter;
      var self = this;

      async.waterfall([
        function(callback) {
          self.sign_in(callback);
        }, function(_status, callback) {
          ev.emit('signed', _status);
          self.get_video(video_id, callback);
        }, function(_status, callback) {
          self.get_flv(video_id, callback);
        }, function(_status, _flvinfo, callback) {
          meta = _.extend(meta, _flvinfo);
          self.get_thumbinfo(video_id, callback);
        }, function(_status, _thumbinfo, callback) {
          meta = _.extend(meta, _thumbinfo);

          var escapedTitle = meta.title.replace(/\//g, "／");
          var filename = "" + escapedTitle + "." + meta.movie_type;
          meta.filepath = path.resolve(path.join(self.output, filename));

          ev.emit('fetched', _status, meta);
          self.http_export(meta.url, meta.filepath, callback);
        }, function(callback) {
          ev.emit('exported', meta.filepath);
        }
      ]);

      return ev;
    }
  };

  // Export module
  return Nicovideo;
});
