dotenv = require('dotenv')
dotenv.load()
assert = require('assert')
path = require('path')

niconico = require('../lib/index')

agent = new niconico.Nicovideo(
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  folder: process.env.FOLDER
)

describe 'niconico', ->
  it 'パラメータがセット出来ていること', ->
    assert.equal agent.email, process.env.EMAIL
    assert.equal agent.password, process.env.PASSWORD
    assert.equal agent.folder, process.env.FOLDER

  it 'サインイン出来ること', (done) ->
    agent.sign_in (error, status) ->
      assert.equal status, 302
      done()

  it 'videoページをget出来ること', (done) ->
    agent.get_video process.env.VIDEO_ID, (error, status) ->
      assert.equal status, 200
      done()

  it 'getflv出来ること', (done) ->
    agent.get_flv process.env.VIDEO_ID, (error, status, flvinfo) ->
      assert.equal status, 200
      done()

  it 'getthumbinfo出来ること', (done) ->
    agent.get_thumbinfo process.env.VIDEO_ID, (error, status, thumbinfo) ->
      assert.equal status, 200
      done()

  describe 'ダウンロードについて', ->
    this.timeout(15000)

    it 'download出来ること', (done) ->
      m = null

      req = agent.download process.env.VIDEO_ID
      req.on 'fetched', (status, meta) ->
        m = meta
        assert.equal meta.video_id, process.env.VIDEO_ID

      req.on 'exported', (filepath) ->
        generated_path = path.join(process.env.FOLDER, "#{m.title}.#{m.movie_type}")
        assert.equal filepath, generated_path
        done()