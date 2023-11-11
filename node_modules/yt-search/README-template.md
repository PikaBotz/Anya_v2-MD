[![npm](https://img.shields.io/npm/v/yt-search.svg?maxAge=3600)](https://www.npmjs.com/package/yt-search)
[![npm](https://img.shields.io/npm/dm/yt-search.svg?maxAge=3600)](https://www.npmjs.com/package/yt-search)
[![npm](https://img.shields.io/npm/l/yt-search.svg?maxAge=3600)](https://www.npmjs.com/package/yt-search)
![mac](https://github.com/talmobi/yt-search/workflows/mac/badge.svg)
![ubuntu](https://github.com/talmobi/yt-search/workflows/ubuntu/badge.svg)
![windows](https://github.com/talmobi/yt-search/workflows/windows/badge.svg)

#  yt-search
simple youtube search API and CLI

![](https://thumbs.gfycat.com/ContentShockingCuttlefish-size_restricted.gif)

## Installation
```bash
npm install yt-search # local module usage
```

## Easy to use
```javascript
%f_search%
```

###### output
```javascript
%f_search_output%
```

#### single video
```javascript
%f_video%
```
###### output
```javascript
%f_video_output%
```

#### single playlist
```javascript
%f_playlist%
```
###### output
```javascript
%f_playlist_output%
```

## CLI Usage (interactive)
```bash
yt-search superman theme
```

If you have `mpv` installed, yt-search can directly play yt videos (or audio only)
```bash
yt-search-video Dank Memes Videos
yt-search-audio Wagner
```

If you don't have `mpv` installed, you can alternatively try installing `yt-play-cli`
```bash
npm install -g yt-play-cli
```

see: https://github.com/talmobi/yt-play


## About
Simple function to get youtube search results.

## Why
Not sure..

## How
Using HTTP requests and parsing the results with [cheerio](https://github.com/cheeriojs/cheerio).

CLI interactive mode with [node-fzf](https://github.com/talmobi/node-fzf)

## Options
```bash
var opts = { query: 'superman theme' }
yts( opts, function ( err, r ) {
	if ( err ) throw err
	console.log( r.videos ) // video results
	console.log( r.playlists ) // playlist results
	console.log( r.channels ) // channel results
	console.log( r.live ) // live stream results
} )

var opts = { videoId: 'e9vrfEoc8_g' }
yts( opts, function ( err, video ) {
	if ( err ) throw err
	console.log( video ) // single video metadata
} )

var opts = { listId: 'PL7k0JFoxwvTbKL8kjGI_CaV31QxCGf1vJ' }
yts( opts, function ( err, playlist ) {
	if ( err ) throw err
	console.log( playlist ) // single playlist metadata
	console.log( playlist.videos ) // playlist videos
} )
```

## Alternatives
[ytsr](https://www.npmjs.com/package/ytsr)

## Test
```
npm test
```
