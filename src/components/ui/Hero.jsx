import { Play, Upload, Heart, Share2 } from "lucide-react";
import heroBg from "../../assets/hero-bg.png";


export function Hero() {
  return (
    <div className="relative w-full min-h-[40vh] p-12 rounded-3xl overflow-hidden">
      
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Base gradient (transparent) */}
      <div className="absolute inset-0 bg-gradient-to-br 
        from-cyan-400/70 
        via-blue-500/60 
        to-purple-600/70"
      />

      {/* Overlay gradient (more transparent) */}
      <div className="absolute inset-0 bg-gradient-to-r 
        from-cyan-400/50 
        via-blue-500/30 
        to-purple-600/50"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between h-full">
        
        {/* Left */}
        <div className="flex flex-col gap-6">
          <span className="capitalize text-5xl font-bold leading-tight text-white">
            DREAM TOP <br /> SIX TRAIN
          </span>

          <div className="flex gap-6">
            <button className="flex items-center gap-2 bg-white text-secondary px-5 py-2 font-medium rounded-full">
              <Play className="fill-secondary w-4 h-4" />
              <span>PLAY ALL</span>
            </button>

            <button className="flex items-center gap-2 bg-white text-secondary px-5 py-2 font-medium rounded-full">
              <Upload className="fill-secondary w-4 h-4" />
              <span>UPLOAD</span>
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <button className="p-2 bg-primary rounded-3xl w-10 h-10">
            <Heart className="text-white" />
          </button>
          <button className="p-2 bg-primary rounded-3xl w-10 h-10">
            <Share2 className="text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}
