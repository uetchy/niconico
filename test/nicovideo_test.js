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
    assert.equal(agent.output, process.env.OUTPUT);
  });

  it('サインイン出来ること', function(done) {
    agent.sign_in()
      .then(function(status) {
        assert.equal(status, 302);
        done();
      })
      .done();
  });

  it('videoページをget出来ること', function(done) {
    agent.get_video(process.env.VIDEO_ID)
      .then(function(status) {
        assert.equal(status, 200);
        done();
      })
      .done();
  });

  it('getflv出来ること', function(done) {
    agent.get_flv(process.env.VIDEO_ID)
      .then(function(flvinfo) {
        done();
      })
      .done();
  });

  it('getthumbinfo出来ること', function(done) {
    agent.get_thumbinfo(process.env.VIDEO_ID)
      .then(function(thumbinfo) {
        done();
      });
  });

  describe('ダウンロードについて', function() {
    this.timeout(20000);

    it('download出来ること', function(done) {
      agent.download(process.env.VIDEO_ID)
        .then(function(fpath) {
          done();
        })
        .done();

      // req.on('fetched', function(status, _meta) {
      //   meta = _meta;
      //   assert.equal(meta.video_id, process.env.VIDEO_ID);
      // });
    });
  });
});
