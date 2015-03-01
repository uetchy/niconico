var EventEmitter, Nicovideo, Promise, _, async, fs, parseString, path, querystring, request;

async = require('async');

fs = require('fs');

path = require('path');

querystring = require('querystring');

request = require('request');

parseString = require('xml2js').parseString;

EventEmitter = require('events').EventEmitter;

Promise = require('bluebird');

_ = require('lodash');

request = request.defaults({
  jar: true
});

Nicovideo = (function() {
  'use strict';
  function Nicovideo(options) {
    this.email = options.email;
    this.password = options.password;
  }

  Nicovideo.prototype.sign_in = function() {
    return new Promise(function(resolve, reject) {
      var options;
      options = {
        url: 'https://secure.nicovideo.jp/secure/login?site=niconico',
        form: {
          mail: Nicovideo.email,
          password: Nicovideo.password
        }
      };
      return request.post(options, function(error, response, body) {
        if (error) {
          reject(response.statusCode);
          return;
        }
        console.log('Login success', response.statusCode);
        return resolve(response.statusCode);
      });
    });
  };

  Nicovideo.prototype.fetch_video_page = function(video_id) {
    return new Promise(function(resolve, reject) {
      var options;
      options = {
        url: 'http://www.nicovideo.jp/watch/' + video_id
      };
      return request.get(options, function(error, response, body) {
        if (error) {
          reject(response.statusCode);
          return;
        }
        console.log('Video page accessing is success', response.statusCode);
        return resolve(response.statusCode);
      });
    });
  };

  Nicovideo.prototype.get_flv = function(video_id) {
    return new Promise(function(resolve, reject) {
      var options;
      options = {
        url: 'http://www.nicovideo.jp/api/getflv?v=' + video_id
      };
      return request.get(options, function(error, response, body) {
        var flvinfo;
        if (error) {
          reject(response.statusCode);
          return;
        }
        console.log('getflv', body);
        flvinfo = {
          thread_id: body.split('&')[0].split('=')[1],
          url: querystring.unescape(body.split('&')[2].split('=')[1])
        };
        return resolve(flvinfo);
      });
    });
  };

  Nicovideo.prototype.get_thumbinfo = function(video_id) {
    return new Promise(function(resolve, reject) {
      var options;
      options = {
        url: 'http://ext.nicovideo.jp/api/getthumbinfo/' + video_id
      };
      return request.get(options, function(error, response, body) {
        if (error) {
          reject(response.statusCode);
          return;
        }
        return parseString(body, function(parseError, result) {
          var thumbinfo;
          if (parseError) {
            reject(error);
            return;
          }
          thumbinfo = {
            video_id: result.nicovideo_thumb_response.thumb[0].video_id[0],
            title: result.nicovideo_thumb_response.thumb[0].title[0],
            description: result.nicovideo_thumb_response.thumb[0].description[0],
            watch_url: result.nicovideo_thumb_response.thumb[0].watch_url[0],
            movie_type: result.nicovideo_thumb_response.thumb[0].movie_type[0]
          };
          return resolve(thumbinfo);
        });
      });
    });
  };

  Nicovideo.prototype.http_export = function(uri, path) {
    return new Promise(function(resolve, reject) {
      return request.head(uri, function(err, res, body) {
        var req;
        req = request(uri).pipe(fs.createWriteStream(path));
        return req.on('finish', resolve);
      });
    });
  };

  Nicovideo.prototype.download = function(video_id) {
    return new Promise(function(resolve, reject) {
      var meta, self;
      meta = {};
      self = this;
      return this.sign_in().then(function(_status) {
        return self.fetch_video_page(video_id);
      }).then(function(_status) {
        return self.get_flv(video_id);
      }).then(function(_flvinfo) {
        meta = _.extend(meta, _flvinfo);
        return self.get_thumbinfo(video_id);
      }).then(function(_thumbinfo) {
        var escapedTitle, filename;
        meta = _.extend(meta, _thumbinfo);
        escapedTitle = meta.title.replace(/\//g, '／');
        filename = '' + escapedTitle + '.' + meta.movie_type;
        meta.filepath = path.resolve(path.join(self.output, filename));
        return http_export(meta.url, meta.filepath);
      }).then(function() {
        return resolve(meta.filepath);
      }).done();
    });
  };

  return Nicovideo;

})();

module.exports = Nicovideo;

//# sourceMappingURL=nicovideo.js.map