# niconico

[![npm version]][npmjs]
[![npm: total downloads](https://badgen.net/npm/dt/niconico)][npmjs]
[![Build Status]][travis]
[![Coverage Status]][coveralls]
[![docs]][docs-url]

[npm version]: https://badgen.net/npm/v/niconico
[npmjs]: https://www.npmjs.com/package/niconico
[build status]: https://travis-ci.com/uetchy/niconico.svg?branch=master
[travis]: https://travis-ci.com/uetchy/niconico
[coverage status]: https://coveralls.io/repos/github/uetchy/niconico/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/uetchy/niconico?branch=master
[docs]: https://badgen.net/badge/documentation/available/purple
[docs-url]: https://uetchy.github.io/niconico/

niconico API library for Node.JS, armed with Promises.

## Usage

```bash
npm install niconico
```

```js
const { niconico, Nicovideo } = require('niconico')

const baseDir = './videos'

async function downloadVideo(videoID) {
  try {
    const session = await niconico.login(
      process.env.EMAIL,
      process.env.PASSWORD
    )
    const client = new Nicovideo(session)
    const filePath = await client.download(videoID, baseDir)

    console.log('Downloaded:', filePath)
  } catch (err) {
    console.log('Error:', err)
  }
}

downloadVideo('sm28222588')
```

## API

[API Documents](https://uetchy.github.io/niconico/)

The APIs return Promises. You can chain them with `then` and `catch`.

### niconico.login(email, password)

Returns a session cookie.

#### email

Type: `string`

#### password

Type: `string`

### new Nicovideo([session])

Returns a nicovideo agent. If a session is given, the agent will be authenticated and act as a signed user.

#### session

a session cookie given by `niconico.login`.

### nicovideo.download(videoID, outputDir)

Download a video to local dir.

#### videoID

Type: `string`

#### outputDir

Type: `string`

### nicovideo.watch(videoID)

Fetch a /watch/ page and returns its metadata.

#### videoID

Type: `string`

### nicovideo.thumbinfo(videoID)

Returns thumbinfo. This doesn't requires `session`.

#### videoID

Type: `string`

### nicovideo.httpExport(url, outputPath)

Download the video from `url` to `outputPath`.

#### url

Type: `string`

#### outputPath

Type: `string`

## Contributing

Before create a pull-request, you need to test using `npm test`.

```
NICONICO_EMAIL=<email> NICONICO_PASSWORD=<password> npm test
```

### Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://uechi.io/"><img src="https://avatars0.githubusercontent.com/u/431808?v=4?s=100" width="100px;" alt=""/><br /><sub><b>uetchy</b></sub></a><br /><a href="https://github.com/uetchy/niconico/commits?author=uetchy" title="Code">💻</a></td>
    <td align="center"><a href="https://hiroppy.me/"><img src="https://avatars1.githubusercontent.com/u/3367801?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yuta Hiroto</b></sub></a><br /><a href="https://github.com/uetchy/niconico/commits?author=hiroppy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/m77so"><img src="https://avatars0.githubusercontent.com/u/5989758?v=4?s=100" width="100px;" alt=""/><br /><sub><b>m77so</b></sub></a><br /><a href="https://github.com/uetchy/niconico/commits?author=m77so" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
