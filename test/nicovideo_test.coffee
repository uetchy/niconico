dotenv = require 'dotenv'
dotenv.load()
assert = require 'assert'
path = require 'path'
niconico = require '../lib/index'

agent = new (niconico.Nicovideo)(
  email: process.env.EMAIL
  password: process.env.PASSWORD
  output: process.env.OUTPUT
)

describe 'niconico', ->
  it 'パラメータがセット出来ていること', ->
    assert.equal agent.email, process.env.EMAIL
    assert.equal agent.password, process.env.PASSWORD
    assert.equal agent.output, process.env.OUTPUT
    return
  it 'サインイン出来ること', (done) ->
    agent.sign_in().then((status) ->
      assert.equal status, 302
      done()
      return
    ).done()
    return
  it 'videoページをget出来ること', (done) ->
    agent.get_video(process.env.VIDEO_ID).then((status) ->
      assert.equal status, 200
      done()
      return
    ).done()
    return
  it 'getflv出来ること', (done) ->
    agent.get_flv(process.env.VIDEO_ID).then((flvinfo) ->
      done()
      return
    ).done()
    return
  it 'getthumbinfo出来ること', (done) ->
    agent.get_thumbinfo(process.env.VIDEO_ID).then (thumbinfo) ->
      done()
      return
    return
  describe 'ダウンロードについて', ->
    @timeout 20000
    it 'download出来ること', (done) ->
      agent.download(process.env.VIDEO_ID).then((fpath) ->
        done()
        return
      ).done()
      # req.on('fetched', function(status, _meta) {
      #   meta = _meta;
      #   assert.equal(meta.video_id, process.env.VIDEO_ID);
      # });
      return
    return
  return
