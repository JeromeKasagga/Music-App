import { Play, Upload, Heart, Share2 } from "lucide-react";
import heroBg from "../../assets/hero-bg.png";


export function Hero() {
  return (
    <div className="relative w-full min-h-[35vh] p-12  rounded-3xl overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Base gradient (transparent) */}
      <div className="absolute inset-0 bg-gradient-to-br 
        from-background/40 
        to-background/80"
      />

      {/* Overlay gradient (more transparent) */}
      <div className="absolute inset-0 bg-gradient-to-r 
        from-background/20 
        to-background/60"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between h-full">

        {/* Left */}
        <div className="flex flex-col gap-6">
          <span className="capitalize text-5xl font-bold leading-tight text-white">
            DREAM TOP <br /> SIX TRAIN
          </span>

          <div className="flex flex-row flex-wrap items-center gap-3">
            <button className="flex-1 min-w-[120px] sm:flex-none flex items-center justify-center gap-2 bg-foreground text-background px-5 py-2 font-medium rounded-full hover:bg-primary transition-colors hover:text-primary-foreground group">
              <Play className="fill-background group-hover:fill-primary-foreground w-4 h-4 transition-colors" />
              <span className="hidden sm:inline">PLAY ALL</span>
              <span className="inline sm:hidden">PLAY</span>
            </button>

            <button className="flex-1 min-w-[120px] sm:flex-none flex items-center justify-center gap-2 bg-foreground text-background px-5 py-2 font-medium rounded-full hover:bg-primary transition-colors hover:text-primary-foreground group">
              <Upload className="fill-background group-hover:fill-primary-foreground w-4 h-4 transition-colors" />
              <span>UPLOAD</span>
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <button className="p-2 bg-primary rounded-3xl w-10 h-10 hover:bg-primary/80 transition-colors">
            <Heart className="text-primary-foreground" />
          </button>
          <button className="p-2 bg-primary rounded-3xl w-10 h-10 hover:bg-primary/80 transition-colors">
            <Share2 className="text-primary-foreground" />
          </button>
        </div>

      </div>
    </div>
  );
}
