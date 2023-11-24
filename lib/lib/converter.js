const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const webp = require('node-webpmux');

exports.createVidSticker = async (buffer, metadata = {}) => {
    const inputPath = `./.temp/input_${randomString(5)}.mp4`;
    fs.writeFileSync(inputPath, buffer);
    const outputPath = `./.temp/output_${randomString(5)}.webp`;
    ensureDirectoryExistence(outputPath);
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(inputPath)
            .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=24, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse", "-loop", "0", "-ss", "00:00:00", "-t", "00:00:05", "-preset", "default", "-an", "-vsync", "0"])
            .toFormat('webp')
            .on('end', async () => {
                console.log('Conversion complete!');
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
            .on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            })
            .save(outputPath);
    });
};

exports.writeExifInVid = async (outputPath, metadata) => {
        const json = {
            "sticker-pack-id": `https://github.com/Pikabotz/Anya_v2-MD`,
            "sticker-pack-name": metadata.packname || "Anya_v2-MD",
            "sticker-pack-publisher": metadata.author || "Pikabotz",
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

function ensureDirectoryExistence(filePath) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function randomString(length) {
    let results = '';
    const characters = 'ABCDEFGHijklmnoPQRSTuvwxYZ1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        results += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return results;
}
