const fs = require('fs');
const path = require('path');

const mediaPath = path.join(__dirname, '../Assets/reaction/');

const getFiles = (dir, extFilter = null) => {
    const files = fs.readdirSync(dir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return extFilter ? extFilter.includes(ext) : true;
    });
    return files;
};

const getRandomFile = (files) => {
    const randomIndex = Math.floor(Math.random() * files.length);
    return files[randomIndex];
};

const loadMedia = (category, separate) => {
    const categoryPath = path.join(mediaPath, category);
    if (!fs.existsSync(categoryPath)) {
        throw new Error(`Category "${category}" does not exist.`);
    }

    let extFilter = null;
    if (separate === 'image') {
        extFilter = ['.jpg', '.jpeg', '.png', '.gif'];
    } else if (separate === 'video') {
        extFilter = ['.mp4'];
    }

    const files = getFiles(categoryPath, extFilter);
    if (files.length === 0) {
        throw new Error(`No media files found in category "${category}" with filter "${separate}".`);
    }

    const randomFile = getRandomFile(files);
    const filePath = path.join(categoryPath, randomFile);
    const buffer = fs.readFileSync(filePath);
    const extension = extFilter ? separate : (['.mp4'].includes(path.extname(randomFile).toLowerCase()) ? 'video' : 'image');

    return { buffer, extension };
};

/**
 * Gets a random media file from the specified category.
 * @param {string} category - The category name.
 * @param {string|null} [separate=null] - Optional parameter to filter by 'image' or 'video'.
 * @returns {{ buffer: Buffer, extension: string }}
 * @creator: https://github.com/PikaBotz
 * ⚠️ Credit required if using!
 */
exports.get = (category, separate = null) => {
    return loadMedia(category, separate);
};

/**
 * Gets a random media file from a random category.
 * @param {string|null} [separate=null] - Optional parameter to filter by 'image' or 'video'.
 * @returns {{ buffer: Buffer, extension: string }}
 * @creator: https://github.com/PikaBotz
 * ⚠️ Credit required if using!
 */
exports.random = (separate = null) => {
    const categories = fs.readdirSync(mediaPath).filter(dir => fs.statSync(path.join(mediaPath, dir)).isDirectory());
    const randomCategory = getRandomFile(categories);
    return loadMedia(randomCategory, separate);
};

/**
 * Gets a random media file from one or more specified categories.
 * @param {string[]} categories - Array of category names.
 * @param {string|null} [separate=null] - Optional parameter to filter by 'image' or 'video'.
 * @returns {{ buffer: Buffer, extension: string }}
 * @creator: https://github.com/PikaBotz
 * ⚠️ Credit required if using!
 */
exports.array = (categories, separate = null) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error('Categories should be a non-empty array.');
    }

    const validCategories = categories.filter(category => fs.existsSync(path.join(mediaPath, category)));
    if (validCategories.length === 0) {
        throw new Error('No valid categories provided.');
    }

    const randomCategory = getRandomFile(validCategories);
    return loadMedia(randomCategory, separate);
};
