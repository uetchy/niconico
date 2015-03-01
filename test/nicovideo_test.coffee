dotenv    = require 'dotenv'
{expect}  = require 'chai'
path      = require 'path'
niconico  = require '../lib/index'
Nicovideo = niconico.nicovideo

require('source-map-support').install()
dotenv.load()

describe 'niconico', ->
  before ->
    @nv = new Nicovideo(
      email: process.env.EMAIL
      password: process.env.PASSWORD
    )

  it 'パラメータがセットされていること', ->
    expect(@nv.email).to.be.equal(process.env.EMAIL)
    expect(@nv.password).to.be.equal(process.env.PASSWORD)

  it 'サインイン出来ること', (done) ->
    @nv.sign_in()
      .then (status) ->
        expect(status).to.be.equal(302)
        done()

  it 'videoページをget出来ること', (done) ->
    @nv.sign_in()
      .then(@nv.fetch_video_page(process.env.VIDEO_ID))
      .then (status) ->
        expect(status).to.be.equal(200)
        done()

  # it 'getflv出来ること', (done) ->
  #   @nv.get_flv(process.env.VIDEO_ID).then((flvinfo) ->
  #     console.log typeof(flvinfo)
  #     done()
  #   )

  # it 'getthumbinfo出来ること', (done) ->
  #   @nv.get_thumbinfo(process.env.VIDEO_ID).then (thumbinfo) ->
  #     done()

  # describe 'ダウンロードについて', ->
  #   @timeout 20000

  #   it 'download出来ること', (done) ->
  #     @nv.download(process.env.VIDEO_ID).then((fpath) ->
  #       done()
  #     ).done()
