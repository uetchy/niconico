import test from 'ava';

import {niconico, Nicovideo} from '../lib';

test.beforeEach(t => {
	t.context.videoID = process.env.VIDEO_ID || 'sm9';
});

test.cb('サインイン出来ること', t => {
	niconico.getSessionKey(process.env.EMAIL, process.env.PASSWORD)
		.then(sessionKey => {
			console.log(sessionKey);
			t.true(sessionKey.includes('nicosid='));
			t.end();
		})
		.catch(err => {
			t.fail(err);
		});
});

test.cb('videoページをget出来ること', t => {
	niconico.getSessionKey(process.env.EMAIL, process.env.PASSWORD)
		.then(sessionKey => {
			const agent = new Nicovideo(sessionKey);
			return agent.fetchVideoPage(t.context.videoID);
		})
		.then(result => {
			t.is(result, 302);
			t.end();
		})
		.catch(err => {
			t.fail(err);
		});
});

test.cb.skip('getflv出来ること', t => {
	t.context.nv.getSessionKey()
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

test.cb.skip('getthumbinfo出来ること', t => {
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
