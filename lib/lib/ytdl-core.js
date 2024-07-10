const ytdl = require('@queenanya/ytdlcore');
const yts = require('@queenanya/ytsearch');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const ytIdRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

class YT {
  static isYouTubeUrl = (url) => {
    return ytIdRegex.test(url);
  }

  /*===========================================*/

  static getVideoID = (url) => {
    if (!this.isYouTubeUrl(url)) {
      throw new Error('Invalid YouTube URL');
    }
    return ytIdRegex.exec(url)[1];
  }

  /*===========================================*/
  
  static search = async (query, options = {}) => {
         const search = await yts.search({ query, hl: 'id', gl: 'ID', ...options })
         return search.videos
  }

  /*===========================================*/
  
  static WriteTags = async (filePath, Metadata) => {
    const tags = {
        title: Metadata.Title || '',
        artist: Metadata.Artist || '',
        originalArtist: Metadata.Artist || '',
        album: Metadata.Album || '',
        year: Metadata.Year || ''
    };

    if (Metadata.Image) {
        tags.image = {
            mime: 'jpeg',
            type: { id: 3, name: 'front cover' },
            imageBuffer: (await fetchBuffer(Metadata.Image)).buffer,
            description: `Cover of ${Metadata.Title || ''}`,
        };
    }

    NodeID3.write(tags, filePath);
};

  /*===========================================*/

  static getAudUrl = async (url) => {
    try {
      if (!url) {
        throw new Error('Video ID or YouTube URL is required');
      }
      const videoId = this.isYouTubeUrl(url) ? this.getVideoID(url) : url;
      const { videoDetails } = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`, { lang: 'id', timeout: 20000 });
      if (!videoDetails.thumbnails.length) {
        throw new Error('No thumbnails available');
      }
      const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly', quality: 140 });
      const path = `./.temp/${videoId + Math.random().toString(36).substr(2, 5)}.mp3`;
      const file = await new Promise((resolve) => {
         ffmpeg(stream).audioFrequency(44100).audioChannels(2).audioBitrate(128).audioCodec('libmp3lame').audioQuality(5).toFormat('mp3').save(path)
          .on('end', () => resolve(path))
      });
      const buffer = await fs.readFileSync(file);
      fs.unlinkSync(file);
      return {
        id: videoId,
        title: videoDetails.title,
        thumb: videoDetails.thumbnails.slice(-1)[0],
        date: formatDateAgo(videoDetails.publishDate),
        duration: formatTimeFromSeconds(videoDetails.lengthSeconds),
        views: formatNumber(videoDetails.viewCount),
        channel: videoDetails.ownerChannelName,
        direct_url: `https://www.youtube.com/watch?v=${videoId}`,
        audio: buffer,
        description: videoDetails.description || false,
      };
    } catch (error) {
      console.log(error)
    }
  }

  /*===========================================*/

    static getVidUrl = async (url) => {
    try {
      if (!url) {
        throw new Error('Video ID or YouTube URL is required');
      }
//      console.log(url)
      const videoId = this.isYouTubeUrl(url) ? this.getVideoID(url) : url;
//      console.log(videoId)
      const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`, { lang: 'id' });
      if (!videoInfo.videoDetails.thumbnails.length) {
        throw new Error('No thumbnails available');
      }
      const qualities = {};
      for (const format of videoInfo.formats.filter(check => check.container === 'mp4' && check.hasAudio === true)) {
        qualities[format.qualityLabel] = format.url;
      }
      return {
        id: videoId,
        title: videoInfo.videoDetails.title,
        thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
        date: formatDateAgo(videoInfo.videoDetails.publishDate),
        duration: formatTimeFromSeconds(videoInfo.videoDetails.lengthSeconds),
        views: formatNumber(videoInfo.videoDetails.viewCount),
        channel: videoInfo.videoDetails.ownerChannelName,
        direct_url: `https://www.youtube.com/watch?v=${videoId}`,
        videoQuality: {
          high: qualities['720p'] || false,
          low: qualities['360p'] || false,
        },
        description: videoInfo.videoDetails.description || false,
      };
    } catch (error) {
      throw error;
    }
  }
  
  /*===========================================*/

  static getVidQ = async (query, range) => {
    if (!query) {
        throw new Error('Video ID or YouTube Query is required');
    }
    const rangeCount = range || 6;
    const getList = await this.search(query);
    const link = getList[getRandomNumber((range > getList.length) ? getList.length : rangeCount)];
    const video = await this.getVidUrl(link.url);
    return video;
  }

  /*===========================================*/

  static getAudQ = async (query, range) => {
    if (!query) {
        throw new Error('Video ID or YouTube Query is required');
    }
    const rangeCount = range || 6;
    const getList = await this.search(query);
    const link = getList[getRandomNumber((range > getList.length) ? getList.length : rangeCount)];
    const video = await this.getAudUrl(link.url);
    return video;
  }

  /*===========================================*/
  
}

function formatTimeFromSeconds(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
}

function formatDateAgo(dateString) {
  const currentDate = new Date();
  const targetDate = new Date(dateString);
  const timeDiff = currentDate - targetDate;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 365) {
    const years = Math.floor(days / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (days > 30) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days >= 1) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours >= 1) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes >= 1) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
}
function getRandomNumber(range) {
      return Math.floor(Math.random() * range); //~ You can choose how much range should be of search list [random]
}
function formatNumber(number) {
  if (number >= 1000000) { return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) { return (number / 1000).toFixed(1) + 'K';
  } else { return number.toString(); }
}

module.exports = YT;
