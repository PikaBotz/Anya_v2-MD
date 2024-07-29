const { createCanvas, loadImage } = require('canvas');
const path = require('path');

/**
 * Crops an image to a square.
 * @param {CanvasImageSource} image - The image to crop.
 * @returns {Canvas} The cropped square canvas.
 */
function cropToSquare(image) {
  const size = Math.min(image.width, image.height);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const x = (image.width - size) / 2;
  const y = (image.height - size) / 2;
  ctx.drawImage(image, x, y, size, size, 0, 0, size, size);
  return canvas;
}

/**
 * Creates a profile image with a background and a profile picture.
 * @param {string} profilePicUrl - The URL of the profile picture.
 * @returns {Promise<Buffer>} A promise that resolves to the image buffer.
 */
exports.createGoodbyeThumb = async (profilePicUrl) => {
  const canvas = createCanvas(2048, 768); // Canvas size for the final image
  const ctx = canvas.getContext('2d');

  // Load the background image
  const bgImagePath = path.join(__dirname, '../Assets/goodbyeBG.jpg'); // Path to the background image
  const bgImage = await loadImage(bgImagePath);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // Load the profile picture
  let profileImage = await loadImage(profilePicUrl);

  // Crop profile picture to a square if necessary
  if (profileImage.width !== profileImage.height) {
    const croppedCanvas = cropToSquare(profileImage);
    profileImage = await loadImage(croppedCanvas.toBuffer());
  }

  const profileX = 1470; // X coordinate for the profile picture
  const profileY = 270;  // Y coordinate for the profile picture
  const profileSize = 400; // Size (width and height) for the profile picture

  ctx.drawImage(profileImage, profileX, profileY, profileSize, profileSize);

  // Add a white border around the profile picture
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.strokeRect(profileX, profileY, profileSize, profileSize);

  // Return the final image buffer
  return canvas.toBuffer('image/jpeg');
}

/**
 * Code by @PikaBotz
 * Original creator: https://github.com/PikaBotz
 * ⚠️ Credit required if using!
 */
