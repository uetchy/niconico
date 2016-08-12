import test from 'ava';

import Nicovideo from '../lib/nicovideo';

test.beforeEach(t => {
	t.context.nv = new Nicovideo({
		email: process.env.EMAIL,
		password: process.env.PASSWORD
	});
	t.context.videoID = process.env.VIDEO_ID || 'sm9';
});

test('パラメータがセットされていること', t => {
	t.is(t.context.nv.email, process.env.EMAIL);
	t.is(t.context.nv.password, process.env.PASSWORD);
});

test.cb('サインイン出来ること', t => {
	t.context.nv.signIn()
		.then(status => {
			t.is(status, 302);
			t.end();
		})
		.catch(err => {
			t.fail(err);
		});
});

test.cb('videoページをget出来ること', t => {
	t.context.nv.signIn()
		.then(t.context.nv.fetchVideoPage(t.context.videoID))
		.then(result => {
			t.is(result, 302);
			t.end();
		})
		.catch(err => {
			t.fail(err);
		});
});

test.cb('getflv出来ること', t => {
	t.context.nv.signIn()
		.then(t.context.nv.fetchVideoPage(t.context.videoID))
		.then(t.context.nv.getFLV(t.context.videoID))
		.then(flvinfo => {
			console.log(flvinfo);
			t.end();
		})
		.catch(err => {
			t.fail(err);
		});
});

test.cb('getthumbinfo出来ること', t => {
	t.context.nv.signIn()
		.then(t.context.nv.getThumbinfo(t.context.videoID))
		.then(thumbinfo => {
			console.log(thumbinfo);
			t.end();
		})
		.catch(err => {
			t.fail(err);
		});
});

// describe 'ダウンロードについて', ->
//   @timeout 20000

//   test('download出来ること', done => {
//     @nv.download(t.context.videoID).then((fpath) => {
//       done()
//     ).done()
