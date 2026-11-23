import React, { useRef, useEffect, useState, useContext } from "react";
import { ChevronLeft, ChevronRight, Music, Play, Pause } from "lucide-react";
import { api } from "@/lib/api";
import { PlayerContext } from "@/Context/PlayerContext";
import EmptyState from "./EmptyState";

function MostListened() {
  const scrollRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await api.getSongs();
        setSongs(data.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch most listened", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();

    const handleUpdate = () => fetchSongs();
    window.addEventListener("library-updated", handleUpdate);
    return () => window.removeEventListener("library-updated", handleUpdate);
  }, []);

  if (loading) return null;
  if (songs.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const itemWidth = 160 + 16;
      const visibleItems = Math.max(
        1,
        Math.floor(container.clientWidth / itemWidth),
      );
      const scrollAmount = visibleItems * itemWidth;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 pt-0 text-white ml-0">
      <div className="flex justify-between items-center mb-3 max-w-[1040px]">
        <h2 className="text-xl font-bold">Recently Added</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1040px] overflow-hidden relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
        >
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => playSong(song, songs)}
              className="w-[140px] sm:w-[160px] flex-shrink-0 group cursor-pointer relative z-10"
            >
              <div className="relative aspect-square w-full rounded-xl bg-secondary flex items-center justify-center mb-3 shadow-lg transition-all duration-300">
                <Music
                  className={`w-12 h-12 text-white/50 transition-opacity duration-300 ${currentSong?.id === song.id ? "opacity-0" : "group-hover:opacity-0"}`}
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl transition-all duration-300 
                    ${currentSong?.id === song.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    pointer-events-none
                  `}
                >
                  <div className="bg-primary rounded-full p-3 shadow-xl transform transition-transform duration-200 active:scale-90">
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause className="w-6 h-6 text-white fill-current" />
                    ) : (
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1 px-1">
                <h3
                  className={`font-semibold text-sm truncate transition-colors ${
                    currentSong?.id === song.id
                      ? "text-primary"
                      : "group-hover:text-primary"
                  }`}
                >
                  {song.title || "Unknown Title"}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {song.artist || "Unknown Artist"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                  Recently Added
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MostListened;
