import React, { useRef } from 'react';
import { Upload } from "lucide-react";
import { api } from '../../lib/api'; 

function UploadButton({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const title = prompt("Enter song title:", file.name.replace('.mp3', ''));
    const artist = prompt("Enter artist name:", "Unknown artist");
    
    if (!title || !artist) return; 
    
    try {
      await api.uploadSong(file, title, artist); 
      alert("Upload successful!");
      onUploadSuccess(); 
    } catch (error) {
      console.error(error);
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
        className="flex items-center gap-2 bg-primary text-white px-5 py-2 font-medium rounded-full hover:bg-primary/90 transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>UPLOAD</span>
      </button>
    </>
  );
}

export default UploadButton;