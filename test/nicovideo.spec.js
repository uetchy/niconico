import test from 'ava';

import {niconico, Nicovideo} from '../lib';

test.beforeEach(t => {
	t.context.videoID = process.env.VIDEO_ID || 'sm28222588';
});

test('サインイン出来ること', t => {
	return niconico
		.getSessionCookie(process.env.EMAIL, process.env.PASSWORD)
		.then(sessionCookie => {
			// console.log('sessionCookie:', sessionCookie);
			const json = sessionCookie
				.getCookies('http://nicovideo.jp')
				.map(l => l.toJSON())
				.map(c => c.key);

			t.true(json.includes('nicosid'));
			t.true(json.includes('user_session'));
		})
		.catch(err => {
			console.log(err);
		});
});

test('videoページをget出来ること', t => {
	return niconico
		.getSessionCookie(process.env.EMAIL, process.env.PASSWORD)
		.then(sessionCookie => {
			const agent = new Nicovideo(sessionCookie);
			return agent.getWatchData(t.context.videoID);
		})
		.then(result => {
			// console.log('watchAPI:', result);
			t.is(result.videoDetail.title, '【ゆめにっき】クリプト・オブ･ザ・モノクロダンサー');
		})
		.catch(err => {
			console.log(err);
		});
});

test('getflv出来ること', t => {
	let agent;
	return niconico
		.getSessionCookie(process.env.EMAIL, process.env.PASSWORD)
		.then(sessionCookie => {
			agent = new Nicovideo(sessionCookie);
			return agent.getWatchData(t.context.videoID);
		})
		.then(() => {
			return agent.getFLV(t.context.videoID);
		})
		.then(flvinfo => {
			// console.log('flvinfo:', flvinfo);
			t.true(Object.keys(flvinfo).includes('threadID'));
			t.true(Object.keys(flvinfo).includes('url'));
		})
		.catch(err => {
			console.log(err);
		});
});

test('getthumbinfo出来ること', t => {
	const agent = new Nicovideo();
	return agent
		.getThumbinfo(t.context.videoID)
		.then(thumbinfo => {
			// console.log('thumbinfo:', thumbinfo);
			t.is(thumbinfo.watchURL, `http://www.nicovideo.jp/watch/${t.context.videoID}`);
		})
		.catch(err => {
			console.log(err);
		});
});

test('download出来ること', t => {
	return niconico
		.getSessionCookie(process.env.EMAIL, process.env.PASSWORD)
		.then(sessionCookie => {
			const agent = new Nicovideo(sessionCookie);
			return agent.download(t.context.videoID, '.');
		})
		.then(destinationPath => {
			console.log(destinationPath);
		})
		.catch(err => {
			console.log(err);
		});
});
