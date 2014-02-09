# hubot-nicovideo

![Usage](screenshots/usage.png)

## Installation
1. `$ npm install git://github.com/oame/hubot-nicovideo.git --save`
2. Add "hubot-nicovideo" into `external-scripts.json`
3. Add NICOVIDEO_EMAIL, NICOVIDEO_PASSWORD, NICOVIDEO_FOLDER into runner script

## Usage

```
> hubot nicovideo [video_id]
```

## Config
### within runner script

```
### hubot-nicovideo
export NICOVIDEO_EMAIL=[email]
export NICOVIDEO_PASSWORD=[password]
export NICOVIDEO_FOLDER=[destination directory]
```