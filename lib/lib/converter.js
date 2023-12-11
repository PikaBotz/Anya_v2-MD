const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const webp = require('node-webpmux');

/**
 * Creates a video sticker from a buffer.
 * @param {Buffer} buffer - The input buffer containing the video data.
 * @param {Object} metadata - Optional metadata for the sticker.
 * @returns {Promise<string>} A promise that resolves to the path of the created video sticker.
 */
exports.createVidSticker = async (buffer, metadata = {}) => {
    const inputPath = `./.temp/input_${randomString(5)}.mp4`;
    fs.writeFileSync(inputPath, buffer);
    const outputPath = `./.temp/output_${randomString(5)}.webp`;
    ensureDirectoryExistence(outputPath);
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
        .on('error', reject)
        .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse", "-loop", "0", "-ss", "00:00:00", "-t", "00:00:05", "-preset", "default", "-an", "-vsync", "0"])
        .toFormat("webp")
        .on('end', async () => {
           //console.log('Conversion complete!');
           const resultFile = await this.writeExifInVid(outputPath, {
                    packname: metadata.packname,
                    author: metadata.author,
                    categories: metadata.categories
           });
           const result = fs.readFileSync(resultFile);
                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(resultFile);
             resolve(result);
         })
        .save(outputPath);
    });
};

/**
 * Writes EXIF metadata in a video sticker.
 * @param {string} outputPath - The path of the video sticker to write the metadata to.
 * @param {Object} metadata - The metadata to write in the video sticker.
 * @returns {Promise<string>} A promise that resolves to the path of the video sticker with the updated metadata.
 */
exports.writeExifInVid = async (outputPath, metadata) => {
        const json = {
            "sticker-pack-id": `https://github.com/Pikabotz/Anya_v2-MD`,
            "sticker-pack-name": metadata.packname || "Anya_v2-MD",
            "sticker-pack-publisher": (metadata.author !== null) ? (metadata.author || "Pikabotz") : '',
            "emojis": metadata.categories ? metadata.categories : ["🥵", "🎐"]
        };
        const exifAttr = Buffer.from([
            0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
        ]);
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);
        ensureDirectoryExistence(outputPath);
        const img = new webp.Image();
        await img.load(outputPath);
        fs.unlinkSync(outputPath);
        img.exif = exif;
        const resultPath = `./.temp/output_${randomString(5)}.webp`;
        await img.save(resultPath);
        return resultPath;
}

/**
 * Ensures the existence of the directory for a given file path.
 * @param {string} filePath - The file path for which to ensure the directory existence.
 */
function ensureDirectoryExistence(filePath) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

/**
 * Generates a random string of the specified length.
 * @param {number} length - The length of the random string to generate.
 * @returns {string} The generated random string.
 */
function randomString(length) {
    let results = '';
    const characters = 'ABCDEFGHijklmnoPQRSTuvwxYZ1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        results += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return results;
}
