/**
 * drawImages
 */

export function drawImages({ context, images = [] }) {
  if ( !Array.isArray(images) ) {
    throw new Error(`Failed to draw images: Invalid images type`);
  }

  images.forEach((img = {}) => {
    const { image, x, y, width, height } = img;
    context.drawImage(image, x, y, width, height)
  });
}