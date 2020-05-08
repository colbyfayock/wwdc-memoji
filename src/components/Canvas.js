import React, { useRef, useEffect } from 'react';

const Canvas = React.forwardRef((props = {}, ref) => {
  const backupRef = useRef();
  const canvasRef = ref || backupRef;

  const { fillStyle, width, height, ...rest } = props;

  useEffect(() => {
    const canvas = canvasRef?.current;
    const context = canvas.getContext('2d');

    context.fillStyle = fillStyle;
    context.fillRect(0, 0, width, height);
  }, [canvasRef, width, height, fillStyle]);

  return (
    <canvas ref={canvasRef} width={width} height={height} {...rest}  />
  )
});

export default Canvas;