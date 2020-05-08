import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onDrop }) => {
  const onDropCallback = useCallback(acceptedFiles => {
    if ( typeof onDrop === 'function' ) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);

  const dropzone = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: onDropCallback
  });

  const { getRootProps, getInputProps, isDragActive } = dropzone;

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      { isDragActive && (
        <p>Drag 'n' drop your Memoji here</p>
      )}
      { !isDragActive && (
        <p>Drag 'n' drop your Memoji here or click to select the file</p>
      )}
    </div>
  )
}

export default Dropzone;