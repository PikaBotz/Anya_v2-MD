const yts = require('yt-search');
const ytIdRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
const playlistIdRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:playlist\?list=|watch\?v=[^&]*&list=)|youtu\.be\/.*\?list=)[a-zA-Z0-9_-]{34}$/;

const youtube = {

    /**
     * Check if the url is correct or not
     */
    isYouTubeUrl: (url) => {
        return ytIdRegex.test(url);
    },
    
    /**
     * Check if the url is correct playlist url or not
     */
    isYouTubePlaylist: (url) => {
        return playlistIdRegex.test(url);
    },
    
    /**
     * Get playing id from the url
     */
    getPlaylistId: (url) => {
        const playlistIdRegex = /(?:youtube\.com\/(?:playlist\?list=|watch\?v=[^&]*&list=)|youtu\.be\/[^\?]*\?list=)([a-zA-Z0-9_-]{34})/;
        const match = url.match(playlistIdRegex);
        return match ? match[1] : null;
    },

    /**
     * Get video id from the url
     */
    getVideoId: (url) => {
        const videoIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/[\w+\/]+\/v\/|videoseries\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(videoIdRegex);
        return match ? match[1] : null;
    },

    /*
     * Search videos/playlist using query
     */
    search: async (query, type) => {
        if (youtube.isYouTubeUrl(query)) {
            throw new Error('Enter A search Term Not Url');
        }
        const info = yts(query).then(r=>{ return r[type] });
        return info;
    },
    
    /**
     * Get playlist's video and playlist info
     */
     getPlaylistInfo: async (url) => {
        if (!youtube.isYouTubePlaylist(url)) {
            throw new Error('Invalid YouTube Playlist URL');
        }
        const id = getPlaylistId(url);
        const info = yts({ listId: id }).then(r=>{ return r });
        return info;
     }
};

module.exports = youtube;