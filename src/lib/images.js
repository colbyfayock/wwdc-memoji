/**
 * promiseToLoadImage
 * @description Returns a promise that resolves an image file
 * @param {object} settings { url: '[Image URL]' }
 */

export function promiseToLoadImage({ url }) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function(data) {
      resolve({
        img: this,
        data
      })
    }

    image.src = url;
  })
}