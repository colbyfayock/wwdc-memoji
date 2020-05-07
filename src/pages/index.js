import React, { useRef, useEffect, useState } from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Container from 'components/Container';

const canvasWidth = 600;
const canvasHeight = 600;
const memojiDefaultWidth = 400;

function promiseToLoadImage({ url }) {
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

const IndexPage = () => {
  const canvasRef = useRef();

  const memojiImgRef = useRef();
  const [memoji, updateMemoji] = useState({
    url: '/images/colby-memoji.jpg',
    width: memojiDefaultWidth
  });

  const [downloadUrl, updateDownloadUrl] = useState();

  useEffect(() => {
    async function loadImages() {
      const { img } = await promiseToLoadImage({
        url: memoji.url
      });

      const imgWidth = memoji?.width;
      const imgRatio = imgWidth / img?.width;
      const imgHeight = img?.height * imgRatio;

      const x = ( canvasWidth - imgWidth ) / 2;
      const y = ( canvasHeight - imgHeight ) / 2;

      updateMemoji({
        width: imgWidth,
        height: imgHeight,
        x,
        y
      });

      memojiImgRef.current = img;
    }

    loadImages();
  }, [memojiImgRef, memoji.url])

  useEffect(() => {
    const memojiImg = memojiImgRef?.current;

    if ( !memojiImg ) return;

    async function loadImages() {
      const overlay = await promiseToLoadImage({
        url: '/images/wwdc-overlay.png'
      });

      const overlayImg = overlay?.img;

      const canvas = canvasRef?.current;
      const context = canvas.getContext('2d');

      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(memojiImg, memoji?.x, memoji?.y, memoji?.width, memoji?.height)
      context.drawImage(overlayImg, 0, 0, canvasWidth, canvasHeight)

      const url = canvasRef?.current.toDataURL('image/jpeg', 1.0);

      updateDownloadUrl(url);
    }

    loadImages();
  }, [canvasRef, memojiImgRef, memoji]);

  /**
   * handleOnChange
   */

  function handleOnChange({ currentTarget } = {}) {
    const value = parseInt(currentTarget.value);
    const name = currentTarget.name;
    updateMemoji(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  /**
   * handleOnChangeSize
   */

  function handleOnChangeSize({ currentTarget } = {}) {
    const value = parseInt(currentTarget.value) / 100;

    const ratio = memojiDefaultWidth / memoji?.width;
    const width = memojiDefaultWidth * value;
    const height = ( memoji?.height * ratio ) * value;

    updateMemoji(prev => {
      return {
        ...prev,
        width,
        height
      }
    })
  }

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container>
        <div className="stage">
          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}  />
          <div className="stage-panel">
            <form>
              <div className="form-row">
                <label htmlFor="size">Size (%)</label>
                <input id="size" type="number" name="size" defaultValue={100} onChange={handleOnChangeSize} />
              </div>
              <div className="form-row">
                <label htmlFor="x">Position X (Distance from left edge)</label>
                <input id="x" type="number" name="x" defaultValue={memoji?.x} onChange={handleOnChange} />
              </div>
              <div className="form-row">
                <label htmlFor="y">Position Y (Distance from top edge)</label>
                <input id="y" type="number" name="y" defaultValue={memoji?.y} onChange={handleOnChange} />
              </div>
            </form>
            <p>
              <a className="button" href={downloadUrl} download="wwdc-memoji.jpg">
                Download
              </a>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default IndexPage;
