var async = require('async');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var request = require('request');
var parseString = require('xml2js').parseString;
var EventEmitter = require('events').EventEmitter;
var Promise = require('promise');
var _ = require('underscore');

var request = request.defaults({jar: true});

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
    sign_in: function() {
      return new Promise(function(resolve, reject) {

        var options = {
          url: "https://secure.nicovideo.jp/secure/login?site=niconico",
          form: {
            mail: Nicovideo.email,
            password: Nicovideo.password
          }
        };

        request.post(options, function(error, response, body) {
          if (error) {
            reject(response.statusCode);
            return;
          }

          console.log("Login success", response.statusCode)

          resolve(response.statusCode);
        });

      });
    },
    get_video: function(video_id) {
      return new Promise(function(resolve, reject) {

        var options = {
          url: "http://www.nicovideo.jp/watch/" + video_id
        };

        request.get(options, function(error, response, body) {
          if (error) {
            reject(response.statusCode);
            return;
          }

          console.log("Video page accessing is success", response.statusCode)

          resolve(response.statusCode);
        });

      });
    },
    get_flv: function(video_id) {
      return new Promise(function(resolve, reject) {

        var options = {
          url: "http://www.nicovideo.jp/api/getflv?v=" + video_id
        };

        request.get(options, function(error, response, body) {
          if (error) {
            reject(response.statusCode);
            return;
          }

          console.log("getflv", body)

          var flvinfo = {
            thread_id: body.split("&")[0].split("=")[1],
            url: querystring.unescape(body.split("&")[2].split("=")[1])
          };
          resolve(flvinfo);
        });

      });
    },
    get_thumbinfo: function(video_id) {
      return new Promise(function(resolve, reject) {

        var options = {
          url: "http://ext.nicovideo.jp/api/getthumbinfo/" + video_id
        };

        request.get(options, function(error, response, body) {
          if (error) {
            reject(response.statusCode);
            return
          }

          parseString(body, function(parseError, result) {
            if (parseError) {
              reject(error);
              return;
            }

            var thumbinfo = {
              video_id: result.nicovideo_thumb_response.thumb[0].video_id[0],
              title: result.nicovideo_thumb_response.thumb[0].title[0],
              description: result.nicovideo_thumb_response.thumb[0].description[0],
              watch_url: result.nicovideo_thumb_response.thumb[0].watch_url[0],
              movie_type: result.nicovideo_thumb_response.thumb[0].movie_type[0]
            };

            resolve(thumbinfo);
          });
        });

      });
    },
    http_export: function(uri, path) {
      return new Promise(function(resolve, reject) {
        request.head(uri, function(err, res, body) {
          var req = request(uri).pipe(fs.createWriteStream(path));
          req.on('finish', resolve);
        });
      });
    },
    download: function(video_id) {
      return new Promise(function(resolve, reject) {

        var meta = {};
        var self = this;

        this.sign_in()
          .then(function(_status) {
            self.get_video(video_id);
          })
          .then(function(_status) {
            self.get_flv(video_id);
          })
          .then(function(_flvinfo) {
            meta = _.extend(meta, _flvinfo);
            self.get_thumbinfo(video_id);
          })
          .then(function(_thumbinfo) {
            meta = _.extend(meta, _thumbinfo);

            var escapedTitle = meta.title.replace(/\//g, "／");
            var filename = "" + escapedTitle + "." + meta.movie_type;
            meta.filepath = path.resolve(path.join(self.output, filename));

            http_export(meta.url, meta.filepath);
          })
          .then(function() {
            resolve(meta.filepath);
          })
          .done()

      });
    }
  };

  // Export module
  return Nicovideo;
});
