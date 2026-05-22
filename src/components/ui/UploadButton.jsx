// button to upload songs
import React from 'react';
import { Upload } from "lucide-react";

function UploadButton() {
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Uploading file:", file.name);
      // Here you would typically call an upload function
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="audio/*"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUploadClick}
        className="flex items-center gap-2 bg-white text-secondary px-5 py-2 font-medium rounded-full hover:bg-gray-200 transition-colors"
      >
        <Upload className="fill-secondary w-4 h-4" />
        <span>UPLOAD</span>
      </button>
    </>
  );
}

export default UploadButton;