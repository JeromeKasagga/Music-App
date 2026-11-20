import React, { useContext } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  MoreHorizontal,
  Heart,
} from "lucide-react";
import { PlayerContext } from "../context/PlayerContext";

function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    progress,
    duration,
    nextSong,
    prevSong,
    toggleShuffle,
    isShuffle,
    currentTime,
    seekTo,
    changeVolume,
    volume,
  } = useContext(PlayerContext);

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 px-4 py-3 flex flex-col gap-3 z-50 md:flex-row md:items-center md:justify-between">
      {/* DESKTOP: Song Info Left */}
      <div className="hidden md:flex items-center gap-3 w-[30%] min-w-[180px]">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shadow-lg flex-shrink-0">
          <div
            className={`w-4 h-4 rounded-full bg-white/20 ${isPlaying ? "animate-pulse" : ""}`}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-white font-medium text-sm truncate">
            {currentSong.title}
          </h4>
          <p className="text-gray-400 text-[11px] truncate">
            {currentSong.artist}
          </p>
        </div>
        <button className="text-gray-400 hover:text-primary transition-colors ml-2 flex-shrink-0">
          <Heart size={16} />
        </button>
      </div>

      {/* CENTER: Controls & Progress */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px] w-full">
        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={toggleShuffle}
            className={`transition-colors ${isShuffle ? "text-primary" : "text-gray-400 hover:text-white"}`}
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={prevSong}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="text-black fill-current" />
            ) : (
              <Play size={18} className="text-black fill-current ml-1" />
            )}
          </button>
          <button
            onClick={nextSong}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Repeat size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full px-2">
          <span className="text-xs text-gray-400 font-mono w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={(e) => seekTo(e.target.value)}
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary hover:accent-white"
          />
          <span className="text-xs text-gray-400 font-mono w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* DESKTOP: Volume & Options Right */}
      <div className="hidden md:flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
        {/* Note: I removed the desktop download button here too, 
                    since you said remove from mobile/tabs. 
                    If you want it back on desktop, uncomment the next line. */}
        {/* <button className="text-gray-400 hover:text-white transition-colors"><Download size={16} /></button> */}

        <div className="flex items-center gap-2 w-24">
          <Volume2 size={16} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => changeVolume(e.target.value)}
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary hover:accent-white"
          />
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* MOBILE: Song Info & Volume (Stacked) */}
      <div className="flex md:hidden items-center justify-between w-full">
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="text-white font-bold text-sm truncate">
            {currentSong.title}
          </h4>
          <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-20">
            <Volume2 size={14} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => changeVolume(e.target.value)}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>
          {/* The download button is completely removed from mobile now */}
        </div>
      </div>
    </div>
  );
}

export default PlayerBar;
