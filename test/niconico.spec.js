import test from 'ava';

import {niconico} from '..';

test.beforeEach(t => {
	t.context.videoID = process.env.VIDEO_ID || 'sm28222588';
});

test('success to sign in', t => {
	return niconico
		.login(process.env.EMAIL, process.env.PASSWORD)
		.then(session => {
			// console.log('session:', session);
			const json = session
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

test('fail to sign in', t => {
	return niconico
		.login(process.env.EMAIL, 'invalidpassword')
		.then(session => {
			const json = session
				.getCookies('http://nicovideo.jp')
				.map(l => l.toJSON())
				.map(c => c.key);

			t.true(json.includes('nicosid'));
			t.false(json.includes('user_session'));
		})
		.catch(err => {
			console.log(err);
		});
});
