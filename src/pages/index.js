import React, { useRef, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import { promiseToLoadImage } from 'lib/images';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Dropzone from 'components/Dropzone';

import defaultMemoji from 'assets/images/colby-memoji.jpg';
import wwdcOverlay from 'assets/images/wwdc-overlay.png';

const canvasWidth = 600;
const canvasHeight = 600;
const memojiDefaultWidth = 500;
const memojiDefaultY = -100;

const IndexPage = () => {
  const canvasRef = useRef();

  const memojiImgRef = useRef();
  const [memoji, updateMemoji] = useState({
    url: defaultMemoji,
    width: memojiDefaultWidth
  });
  const memojiSize = Math.round(memoji?.width / memojiDefaultWidth * 100);

  const [downloadUrl, updateDownloadUrl] = useState();

  useEffect(() => {
    async function loadImages() {
      const { img } = await promiseToLoadImage({
        url: memoji.url
      });

      updateImageState(img, {
        url: memoji.url
      });
    }
    loadImages();
  }, [memojiImgRef, memoji.url])

  useEffect(() => {
    const memojiImg = memojiImgRef?.current;

    if ( !memojiImg ) return;

    async function loadImages() {
      const overlay = await promiseToLoadImage({
        url: wwdcOverlay
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

  function handleOnChangeX(value) {
    handleOnChangeValueByName('x', value);
  }

  /**
   * handleOnChange
   */

  function handleOnChangeY(value) {
    handleOnChangeValueByName('y', value);
  }

  /**
   * handleOnChangeValueByName
   */

  function handleOnChangeValueByName(name, value) {
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

  function handleOnChangeSize(value) {
    const multiplier = value / 100;
    const ratio = memojiDefaultWidth / memoji?.width;
    const width = memojiDefaultWidth * multiplier;
    const height = ( memoji?.height * ratio ) * multiplier;
    updateMemoji(prev => {
      return {
        ...prev,
        width,
        height
      }
    });
  }

  /**
   * handleOnDrop
   */

  function handleOnDrop(files) {
    const fileUrl = URL.createObjectURL(files[0]);
    const image = new Image();

    image.onload = function() {
      updateImageState(image, {
        url: fileUrl
      })
    }

    image.src = fileUrl;
  }

  /**
   * updateImageState
   */

  function updateImageState(image, settings = {}) {
    const imgWidth = memoji?.width;
    const imgRatio = imgWidth / image?.width;
    const imgHeight = image?.height * imgRatio;

    const x = ( canvasWidth - imgWidth ) / 2;
    const y = ( ( canvasHeight - imgHeight ) / 2 ) + memojiDefaultY;

    memojiImgRef.current = image;

    updateMemoji({
      width: imgWidth,
      height: imgHeight,
      x,
      y,
      ...settings
    });
  }

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container type="full">
        <div className="stage">
          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}  />
          <div className="stage-panel">
            <form>
              <div className="form-row">
                <Dropzone onDrop={handleOnDrop} />
              </div>
              <div className="form-row form-row-range">
                <label htmlFor="size">Size (%)</label>
                <InputRange
                  name="size"
                  maxValue={200}
                  minValue={0}
                  step={1}
                  value={memojiSize}
                  onChange={handleOnChangeSize} />
              </div>
              <div className="form-row form-row-range">
                <label htmlFor="x">Position X (Distance from left edge)</label>
                <InputRange
                  name="x"
                  maxValue={200}
                  minValue={-200}
                  step={1}
                  value={Math.round(memoji?.x)}
                  onChange={handleOnChangeX} />
              </div>
              <div className="form-row form-row-range">
                <label htmlFor="y">Position Y (Distance from top edge)</label>
                <InputRange
                  name="y"
                  maxValue={200}
                  minValue={-200}
                  step={1}
                  value={Math.round(memoji?.y)}
                  onChange={handleOnChangeY} />
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
