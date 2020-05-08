import React, { useRef, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import { promiseToLoadImage } from 'lib/images';
import { drawImages } from 'lib/canvas';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Dropzone from 'components/Dropzone';
import Canvas from 'components/Canvas';

import defaultMemojiUrl from 'assets/images/colby-memoji.jpg';
import wwdcOverlay from 'assets/images/wwdc-overlay.png';

const canvasWidth = 600;
const canvasHeight = 600;
const memojiDefaultWidth = 560;
const memojiDefaultX = 15;
const memojiDefaultY = -97;

const defaultMemoji = {
  url: defaultMemojiUrl,
  width: memojiDefaultWidth,
  x: memojiDefaultX,
  y: memojiDefaultY
}

const IndexPage = () => {
  const canvasRef = useRef();

  const memojiImgRef = useRef();
  const [memoji, updateMemoji] = useState(defaultMemoji);
  const memojiSize = Math.round(memoji?.width / memojiDefaultWidth * 100);

  const [downloadUrl, updateDownloadUrl] = useState();

  useEffect(() => {
    async function loadImages() {
      const { img } = await promiseToLoadImage({
        url: memoji.url
      });

      updateImageState(img, {
        ...defaultMemoji,
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

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const images = [
        {
          image: memojiImg,
          ...memoji
        },
        {
          image: overlayImg,
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight
        }
      ]

      drawImages({
        context,
        images
      });

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

    const x = settings?.x || ( canvasWidth - imgWidth ) / 2;
    const y = settings?.y || ( canvasHeight - imgHeight ) / 2;

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
          <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} fillStyle="black"  />
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
                <label htmlFor="x">Position X (From left edge)</label>
                <InputRange
                  name="x"
                  maxValue={200}
                  minValue={-200}
                  step={1}
                  value={Math.round(memoji?.x)}
                  onChange={handleOnChangeX} />
              </div>
              <div className="form-row form-row-range">
                <label htmlFor="y">Position Y (From top edge)</label>
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
