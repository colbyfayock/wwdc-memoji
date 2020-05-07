import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

const Dropzone = ({ onDrop }) => {

  const onDropCallback = useCallback(acceptedFiles => {
    if ( typeof onDrop === 'function' ) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);

  const dropzone = useDropzone({
    onDrop: onDropCallback
  });
  const { getRootProps, getInputProps, isDragActive } = dropzone;

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default Dropzone;