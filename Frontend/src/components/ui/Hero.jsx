import { Play, Upload, Heart, Share2 } from "lucide-react";
import heroBg from "../../assets/hero-bg.png";
import { useContext } from "react";
import { PlayerContext } from "@/Context/PlayerContext";

export function Hero({ scrollY = 0 }) {
  const { currentSong } = useContext(PlayerContext);

  const displayTitle = currentSong ? currentSong.title : "Your Music Library";
  const displayArtist = currentSong ? currentSong.artist : "Select a song to start playing";

  // Continuous 0→1 progress over the first 120px of scroll — no binary snap = no shake
  const progress = Math.min(1, scrollY / 120);
  const isCollapsed = progress > 0.5;

  // Smoothly interpolate font size and content opacity
  const titleSize  = 3.5 - progress * 1.5;   // rem: 3.5 → 2.0
  const buttonsOpacity = Math.max(0, 1 - progress * 2);
  const iconsOpacity   = Math.max(0, 1 - progress * 2);

  return (
    // Outer div fills the sticky wrapper exactly — no fixed height needed
    <div className="w-full h-full relative">
      <div className="w-full h-full relative rounded-b-3xl overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-background/90" />

        {/* Content */}
        <div className="relative z-10 flex items-end justify-between h-full px-5 py-4 md:px-12 md:py-8">

          <div className="flex flex-col min-w-0 flex-1 mr-3">
            <span
              className="capitalize font-bold leading-tight text-white line-clamp-1"
              style={{ fontSize: `clamp(1.4rem, ${titleSize}rem, 3.5rem)` }}
            >
              {displayTitle}
            </span>

            <span
              className="text-gray-300 line-clamp-1 text-sm md:text-lg"
              style={{ opacity: Math.max(0.4, 1 - progress * 1.5) }}
            >
              {displayArtist}
            </span>

            {/* Action buttons — fade + collapse smoothly */}
            <div
              className="flex flex-row flex-wrap items-center gap-2 mt-2 overflow-hidden"
              style={{
                opacity: buttonsOpacity,
                maxHeight: `${(1 - progress) * 56}px`,
                pointerEvents: isCollapsed ? "none" : "auto",
              }}
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("trigger-play-all"))}
                className="flex items-center justify-center gap-1.5 bg-white text-black
                           px-4 py-2 text-sm font-bold rounded-full
                           hover:bg-primary hover:text-white transition-colors
                           whitespace-nowrap"
              >
                <Play className="fill-current w-3.5 h-3.5 shrink-0" />
                <span>PLAY ALL</span>
              </button>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent("trigger-upload"))}
                className="flex items-center justify-center gap-1.5 bg-black/50 border border-white/20 text-white
                           px-4 py-2 text-sm font-bold rounded-full
                           hover:bg-white/10 transition-colors
                           whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span>UPLOAD</span>
              </button>
            </div>
          </div>

          {/* Right icon column — fade out when scrolled */}
          <div
            className="flex flex-col gap-3 shrink-0"
            style={{
              opacity: iconsOpacity,
              pointerEvents: isCollapsed ? "none" : "auto",
            }}
          >
            <button className="p-2 bg-primary/80 rounded-3xl w-9 h-9 md:w-10 md:h-10 hover:bg-primary transition-colors flex items-center justify-center">
              <Heart className="text-white w-5 h-5" />
            </button>
            <button className="p-2 bg-primary/80 rounded-3xl w-9 h-9 md:w-10 md:h-10 hover:bg-primary transition-colors flex items-center justify-center">
              <Share2 className="text-white w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}