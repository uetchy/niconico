var dotenv = require('dotenv');
dotenv.load();
var assert = require('assert');
var path = require('path');
var niconico = require('../lib/index');

var agent = new niconico.Nicovideo({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  output: process.env.OUTPUT
});

describe('niconico', function() {
  it('パラメータがセット出来ていること', function() {
    assert.equal(agent.email, process.env.EMAIL);
    assert.equal(agent.password, process.env.PASSWORD);
    return assert.equal(agent.output, process.env.OUTPUT);
  });
  it('サインイン出来ること', function(done) {
    return agent.sign_in(function(error, status) {
      assert.equal(status, 302);
      return done();
    });
  });
  it('videoページをget出来ること', function(done) {
    return agent.get_video(process.env.VIDEO_ID, function(error, status) {
      assert.equal(status, 200);
      return done();
    });
  });
  it('getflv出来ること', function(done) {
    return agent.get_flv(process.env.VIDEO_ID, function(error, status, flvinfo) {
      assert.equal(status, 200);
      return done();
    });
  });
  it('getthumbinfo出来ること', function(done) {
    return agent.get_thumbinfo(process.env.VIDEO_ID, function(error, status, thumbinfo) {
      assert.equal(status, 200);
      return done();
    });
  });
  return describe('ダウンロードについて', function() {
    this.timeout(15000);
    return it('download出来ること', function(done) {
      var m, req;
      m = null;
      req = agent.download(process.env.VIDEO_ID);
      req.on('fetched', function(status, meta) {
        m = meta;
        return assert.equal(meta.video_id, process.env.VIDEO_ID);
      });
      return req.on('exported', function(filepath) {
        var generated_path;
        generated_path = path.join(path.resolve(".", process.env.OUTPUT), "" + m.title + "." + m.movie_type);
        assert.equal(filepath, generated_path);
        return done();
      });
    });
  });
});
