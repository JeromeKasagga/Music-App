import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from "./EmptyState";

const mostPlayedSongs = [
  { id: "1", title: "Midnight Dreams", artist: "Luna Echo", play_count: 47 },
  { id: "2", title: "Neon Nights", artist: "Synthwave Collective", play_count: 32 },
  { id: "3", title: "Ocean Waves", artist: "Coastal Beats", play_count: 28 },
  { id: "4", title: "Electric Soul", artist: "The Groove Masters", play_count: 19 },
  { id: "5", title: "Sunset Boulevard", artist: "City Lights", play_count: 15 },
  { id: "6", title: "Cosmic Journey", artist: "Space Cadets", play_count: 12 },
  { id: "7", title: "Solar Echo", artist: "Nova", play_count: 10 },
  { id: "8", title: "Starlight", artist: "The Drifters", play_count: 9 },
  { id: "9", title: "Deep Sea", artist: "Sub Zero", play_count: 8 },
  { id: "10", title: "Cyber Funk", artist: "Neon City", play_count: 7 },
  { id: "11", title: "Lofi Rain", artist: "Study Beats", play_count: 6 },
  { id: "12", title: "Mountain Peak", artist: "Nature Sounds", play_count: 5 },
  { id: "13", title: "City Traffic", artist: "Urban Life", play_count: 4 },
  { id: "14", title: "Forest Bird", artist: "Woods", play_count: 3 },
];

function MostListened() {
  const scrollRef = useRef(null);

  if (mostPlayedSongs.length === 0) return <EmptyState />;

  const scroll = (direction) => {
    if (scrollRef.current) {
      // Calculate width of one page (7 items + their gaps)
      // 160px card width + 16px gap (gap-4)
      const itemWidth = 160 + 16;
      const scrollAmount = itemWidth * 7;

      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="p-8 text-white ml-0">
      <div className="flex justify-between items-center mb-3 max-w-[1040px]">
        <h2 className="text-xl font-bold">Most Listened</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 
        Container uses overflow-hidden to prevent manual scrolling.
        Width is set to fit exactly 6 cards (6 * 160px + 5 * 16px gap = 1040px).
        Using max-w-[1040px] ensures only 6 are shown even on large screens.
      */}
      <div className="w-full max-w-[1040px] overflow-hidden relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth pb-4"
        >
          {mostPlayedSongs.map((song) => (
            <div
              key={song.id}
              className="w-[160px] flex-shrink-0 group cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-xl bg-secondary flex items-center justify-center mb-3 shadow-lg transition-all duration-300">
                <svg className="w-12 h-12 text-white/90 transition-opacity duration-300 group-hover:opacity-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="bg-white rounded-full p-3 shadow-xl transform transition-transform duration-200 active:scale-90">
                    <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1 px-1">
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{song.title}</h3>
                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{song.play_count} plays</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MostListened;
