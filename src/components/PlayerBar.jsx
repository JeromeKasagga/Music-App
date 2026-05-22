import React, { useState } from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Volume2,
    Maximize2,
    Mic2,
    ListMusic
} from 'lucide-react';
import { Slider } from "@/components/ui/slider";

function PlayerBar() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(33);
    const [volume, setVolume] = useState(80);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-[90px] px-4 flex items-center justify-between z-50">
            {/* Song Info */}
            <div className="flex items-center gap-4 w-[30%] min-w-[200px]">
                <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
                </div>
                <div className="hidden md:block">
                    <h4 className="text-white font-medium text-sm truncate">Midnight Dreams</h4>
                    <p className="text-gray-400 text-xs hover:text-white cursor-pointer transition-colors">Luna Echo</p>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                </button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-2 max-w-[45%] w-full">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => console.log("Toggle Shuffle")}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Shuffle size={16} />
                    </button>
                    <button
                        onClick={() => console.log("Previous Song")}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <SkipBack size={20} fill="currentColor" />
                    </button>
                    <button
                        onClick={() => {
                            const newState = !isPlaying;
                            setIsPlaying(newState);
                            console.log(newState ? "Playing" : "Paused");
                        }}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ? (
                            <Pause size={18} className="text-black fill-current" />
                        ) : (
                            <Play size={18} className="text-black fill-current ml-1" />
                        )}
                    </button>
                    <button
                        onClick={() => console.log("Next Song")}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <SkipForward size={20} fill="currentColor" />
                    </button>
                    <button
                        onClick={() => console.log("Toggle Repeat")}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Repeat size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2 w-full max-w-[500px]">
                    <span className="text-xs text-gray-500 font-mono">1:24</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
                        <div
                            className="h-full bg-foreground group-hover:bg-primary transition-colors relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">4:05</span>
                </div>
            </div>

            {/* Volume & Options */}
            <div className="flex items-center justify-end gap-3 w-[30%] min-w-[200px]">
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Mic2 size={16} />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <ListMusic size={16} />
                </button>
                <div className="flex items-center gap-2 w-24 group">
                    <Volume2 size={16} className="text-gray-400" />
                    <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden">
                        <div className="h-full bg-foreground w-[80%] group-hover:bg-primary transition-colors" />
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Maximize2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default PlayerBar;
