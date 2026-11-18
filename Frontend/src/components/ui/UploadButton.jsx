// button to upload songs
import React from "react";
import { Upload } from "lucide-react";
import { api } from "../../lib/api";

function UploadButton({ onUploadSuccess }) {
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    console.log("Upload button clicked!");
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const title = prompt("Enter song title:", file.name.replace(".mp3", ""));
    const artist = prompt("Enter artist name:", "Unknown artist");

    if (!title || !artist) return;
    try {
      await api.uploadSong(file, title, artist);
      alert("Upload Successful!")
      onUploadSuccess();
    } catch (error) {
      console.log(error);
      alert("Upload failed, check console.");
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
