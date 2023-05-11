import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';

const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const style = {
    "borderWidth": "2px",
    "borderStyle": "dashed",
    "borderRadius": "5px",
  }


  return (
    <div
      {...getRootProps()}
      style={style}
      className=" border-sky-500 border-8  border-opacity-95 w-full  flex justify-center items-center min-h-screen rounded-md"
    >
      <input {...getInputProps()} directory="" webkitdirectory="" mozdirectory="" />
      <div className=" flex flex-col items-center">
        <div className="relative text-sky-300 opacity-20">
          <FontAwesomeIcon icon={faFileUpload} size="2x" className=" opacity-5" />
        </div>

        <div className="relative">
          <p className="opacity-50">Drag and drop your project folder here</p>
        </div>
      </div>

    </div>
  );
};

export default Dropzone;
