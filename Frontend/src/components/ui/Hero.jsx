import { Play, Upload, Heart, Share2 } from "lucide-react";
import heroBg from "../../assets/hero-bg.png";
import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";

export function Hero({ isCollapsed }) {
  const { currentSong } = useContext(PlayerContext);

  const displayTitle = currentSong ? currentSong.title : "Your Music Library";
  const displayArtist = currentSong ? currentSong.artist : "Select a song to start playing";

  return (
    <div className="w-full h-[35vh] relative">
      {/* The inner container changes height, but always stays 100% width */}
      <div 
        className={`w-full relative rounded-b-3xl overflow-hidden transition-all duration-300 ease-in-out
          ${isCollapsed ? 'h-[18vh]' : 'h-full'}
        `}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-background/90" />

        {/* Content */}
        <div className="relative z-10 flex items-end justify-between h-full p-8 md:p-12">
          
          <div className="flex flex-col w-3/4">
            <span 
              className={`capitalize font-bold leading-tight text-white transition-all duration-300 line-clamp-1
                ${isCollapsed ? 'text-3xl' : 'text-4xl md:text-6xl'}
              `}
            >
              {displayTitle}
            </span>
            
            <span 
              className={`text-gray-300 transition-all duration-300 line-clamp-1
                ${isCollapsed ? 'text-sm' : 'text-lg'}
              `}
            >
              {displayArtist}
            </span>

            {/* Buttons fade out and collapse their height when scrolling */}
            <div 
              className={`flex flex-row items-center gap-3 transition-all duration-300 overflow-hidden
                ${isCollapsed ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-2'}
              `}
            >
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('trigger-play-all'))}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 font-bold rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <Play className="fill-current w-4 h-4" />
                <span>PLAY ALL</span>
              </button>

              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('trigger-upload'))}
                className="flex items-center justify-center gap-2 bg-black/50 border border-white/20 text-white px-6 py-2 font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD</span>
              </button>
            </div>
          </div>

          {/* Right Icons fade out when collapsed */}
          <div className={`flex flex-col gap-4 transition-all duration-300 overflow-hidden
            ${isCollapsed ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}
          `}>
            <button className="p-2 bg-primary/80 rounded-3xl w-10 h-10 hover:bg-primary transition-colors">
              <Heart className="text-white w-6 h-6" />
            </button>
            <button className="p-2 bg-primary/80 rounded-3xl w-10 h-10 hover:bg-primary transition-colors">
              <Share2 className="text-white w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}