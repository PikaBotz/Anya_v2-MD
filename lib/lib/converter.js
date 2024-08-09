const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const webp = require('node-webpmux');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { PassThrough } = require('stream');
const { getRandom } = require(__dirname + '/myfunc');

//༺─────────────────────────────────────༻

/**
 * Converts an image buffer to a WebP format.
 * 
 * @param {Buffer} media - The image buffer that needs to be converted.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the WebP image.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
async function imageToWebp(media) {
    const directory = path.join(__dirname, '../../.temp');
    const tmpFileOut = path.join(directory, getRandom(7) + ".webp")
    const tmpFileIn = path.join(directory, getRandom(7) + ".jpg")
    fs.writeFileSync(tmpFileIn, media);
    await new Promise((resolve, reject) => {
        ffmpeg(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    });
    const buffer = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buffer
}
exports.imageToWebp = imageToWebp;

//༺─────────────────────────────────────༻

/**
 * Converts a video buffer to a WebP format.
 * 
 * @param {Buffer} media - The video buffer that needs to be converted.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the WebP video.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
async function videoToWebp(media) {
    const directory = path.join(__dirname, '../../.temp');
    const tmpFileOut = path.join(directory, getRandom(7) + ".webp")
    const tmpFileIn = path.join(directory, getRandom(7) + ".mp4")
    fs.writeFileSync(tmpFileIn, media);
    await new Promise((resolve, reject) => {
        ffmpeg(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    });
    const buffer = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buffer
}
exports.videoToWebp = videoToWebp;

//༺─────────────────────────────────────

/**
 * Converts an image to WebP format and writes EXIF metadata to it.
 * 
 * @param {Buffer} media - The image buffer that needs to be converted and have EXIF metadata written to.
 * @param {Object} metadata - The metadata object containing the pack name, author, and optional categories.
 * @param {string} metadata.packname - The name of the sticker pack.
 * @param {string} metadata.author - The author of the sticker pack.
 * @param {string[]} [metadata.categories] - Optional categories or emojis to associate with the sticker.
 * @returns {Promise<string>} - A promise that resolves to the file path of the WebP image with EXIF metadata.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
exports.writeExifImg = async (media, metadata) => {
    const toWebp = await videoToWebp(media);
    const directory = path.join(__dirname, '../../.temp');
    const tmpFileOut = path.join(directory, getRandom(7) + ".webp");
    const tmpFileIn = path.join(directory, getRandom(8) + ".webp");
    fs.writeFileSync(tmpFileIn, toWebp);
    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = { "sticker-pack-id": "https://github.com/PikaBotz", "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : ["🤩", "🎊"] };
        const exifAttribute = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttribute, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);
        await img.load(tmpFileIn);
        fs.unlinkSync(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);
        return tmpFileOut;
    }
}

//༺─────────────────────────────────────

/**
 * Converts a video to WebP format and writes EXIF metadata to it.
 * 
 * @param {Buffer} media - The video buffer that needs to be converted and have EXIF metadata written to.
 * @param {Object} metadata - The metadata object containing the pack name, author, and optional categories.
 * @param {string} metadata.packname - The name of the sticker pack.
 * @param {string} metadata.author - The author of the sticker pack.
 * @param {string[]} [metadata.categories] - Optional categories or emojis to associate with the sticker.
 * @returns {Promise<string>} - A promise that resolves to the file path of the WebP video with EXIF metadata.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
exports.writeExifVid = async (media, metadata) => {
    const toWebp = await imageToWebp(media);
    const directory = path.join(__dirname, '../../.temp');
    const tmpFileOut = path.join(directory, getRandom(7) + ".webp");
    const tmpFileIn = path.join(directory, getRandom(8) + ".webp");
    fs.writeFileSync(tmpFileIn, toWebp);
    if (metadata.packname || metadata.author) {
        const vid = new webp.Image()
        const json = { "sticker-pack-id": "https://github.com/PikaBotz", "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : ["🤩", "🎊"] };
        const exifAttribute = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttribute, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);
        await vid.load(tmpFileIn);
        fs.unlinkSync(tmpFileIn);
        vid.exif = exif;
        await vid.save(tmpFileOut);
        return tmpFileOut;
    }
}

//༺─────────────────────────────────────

/**
 * Converts media to WebP format and writes EXIF metadata to it.
 * 
 * @param {Object} media - The media object that needs to be converted and have EXIF metadata written to.
 * @param {Buffer} media.data - The media buffer (image or video) to be converted.
 * @param {string} media.mimetype - The MIME type of the media (e.g., 'image/jpeg', 'video/mp4').
 * @param {Object} metadata - The metadata object containing the pack name, author, and optional categories.
 * @param {string} metadata.packname - The name of the sticker pack.
 * @param {string} metadata.author - The author of the sticker pack.
 * @param {string[]} [metadata.categories] - Optional categories or emojis to associate with the sticker.
 * @returns {Promise<string>} - A promise that resolves to the file path of the WebP image with EXIF metadata.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
exports.writeExif = async (media, metadata) => {
    const toWebp = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : "";
    const directory = path.join(__dirname, '../../.temp');
    const tmpFileOut = path.join(directory, getRandom(7) + ".webp");
    const tmpFileIn = path.join(directory, getRandom(8) + ".webp");
    fs.writeFileSync(tmpFileIn, toWebp);
    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = { "sticker-pack-id": "https://github.com/PikaBotz", "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : ["🤩", "🎊"] }
        const exifAttribute = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttribute, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);
        await img.load(tmpFileIn);
        fs.unlinkSync(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);
        return tmpFileOut;
    }
}

//༺─────────────────────────────────────

/**
 * Adds EXIF metadata to a WebP image buffer.
 * 
 * @param {Buffer} buffer - The WebP image buffer to which EXIF metadata will be added.
 * @param {string} packname - The name of the sticker pack.
 * @param {string} author - The author of the sticker pack.
 * @param {string[]} [categories=["🤩", "🎊"]] - Optional categories or emojis to associate with the sticker.
 * @param {Object} [extra={}] - Additional metadata fields to include in the EXIF data.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the WebP image with EXIF metadata.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
exports.addExif = async (buffer, packname, author, categories = ["🤩", "🎊"], extra = {}) => {
	const img = new webp.Image();
	const json = { 'sticker-pack-id': 'PikaBotz', 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, 'is-avatar-sticker': 1, ...extra };
	let exifAttribute = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
	let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
	let exif = Buffer.concat([exifAttribute, jsonBuffer]);
	exif.writeUIntLE(jsonBuffer.length, 14, 4);
	await img.load(buffer);
	img.exif = exif;
	return await img.save(null);
}

//༺─────────────────────────────────────

/**
 * Converts an audio buffer to a video with a black background.
 * 
 * @param {Buffer} media - The audio buffer to be converted to video.
 * @returns {Promise<{status: boolean, buffer?: Buffer, message?: string}>} - A promise that resolves to an object with the conversion status, resulting video buffer if successful, and an error message if failed.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
exports.audioToVideo = async (media) => {
 const fs = require('fs').promises;
 try {
    try {
        await exec('ffmpeg -version');
    } catch {
        return {
            status: false,
            message: "❕ *ffmpeg* isn't downloaded"
        }
    }
    const directory = path.join(__dirname, '../../.temp');
    const videoName = getRandom(5) + ".mp4";
    const audioName = getRandom(6) + ".mp3";
    const blackName = getRandom(7) + ".mp4";
    const videoFilePath = path.join(directory, videoName);
    const audioFilePath = path.join(directory, audioName);
    const blackPath = path.join(directory, blackName);
    await fs.writeFile(audioFilePath, media);
    const audioDuration = media.length / 44100;
    await exec(`ffmpeg -f lavfi -i color=c=black:s=720x720:r=30 -t ${audioDuration} -pix_fmt yuv420p -vf "scale=720:720" -an -y ${blackPath}`);
    await exec(`ffmpeg -i ${blackPath} -i ${audioFilePath} -c:v copy -c:a aac -strict experimental -y ${videoFilePath}`);
    await fs.unlink(blackPath);
    await fs.unlink(audioFilePath);
    const result = await fs.readFile(videoFilePath);
    await fs.unlink(videoFilePath);
    return {
        status: true,
        buffer: result
    }
  } catch (e) {
    console.log(e)
    return {
        status: false,
        message: e.toString()
    }
  }
}

//༺─────────────────────────────────────

/**
 * Converts a WebP sticker buffer to a video format.
 * 
 * @param {Buffer} stickerBuffer - The WebP sticker buffer to be converted to video.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the converted video.
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
exports.stickerToVideo = (stickerBuffer, fps = 30) => {
  return new Promise((resolve, reject) => {
    const directory = path.join(__dirname, '../../.temp');
    const webpFilePath = path.join(directory, getRandom(8) + ".webp");
    const mp4FilePath = path.join(directory, getRandom(8) + ".mp4");

    fs.writeFile(webpFilePath, stickerBuffer, (err) => {
      if (err) return reject(err);

      const ffmpegCommand = `ffmpeg -y -loop 1 -framerate ${fps} -i ${webpFilePath} -c:v libx264 -pix_fmt yuv420p -t 10 ${mp4FilePath}`;

      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('FFmpeg Error:', stderr);
          fs.unlink(webpFilePath, () => {}); // Clean up temporary files
          return reject(error);
        }

        fs.readFile(mp4FilePath, (err, data) => {
          if (err) {
            fs.unlink(webpFilePath, () => {});
            fs.unlink(mp4FilePath, () => {});
            return reject(err);
          }

          fs.unlink(webpFilePath, () => {});
          fs.unlink(mp4FilePath, () => {});

          resolve(data);
        });
      });
    });
  });
};

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 * 
 * @project: https://github.com/PikaBotz/Anya_v2-MD
 * @author: https://github.com/PikaBotz
 */
exports.toAudio = (buffer, ext) => {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(buffer);
    const command = ffmpeg(inputStream)
      .inputFormat(ext)
      .audioCodec('libmp3lame')
      .audioChannels(2)
      .audioBitrate('128k')
      .audioFrequency(44100)
      .format('mp3')
      .on('end', () => {
        const chunks = [];
        const outputStream = new PassThrough();
        command.pipe(outputStream);
        outputStream.on('data', chunk => chunks.push(chunk));
        outputStream.on('end', () => resolve(Buffer.concat(chunks)));
        outputStream.on('error', reject);
      })
      .on('error', reject);
    command.run();
  });
}
