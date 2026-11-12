import React, { useState } from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Volume2,
    Download,
    MoreHorizontal,
    Heart
} from 'lucide-react';
import { Slider } from "@/components/ui/slider";

function PlayerBar() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(33);
    const [volume, setVolume] = useState(80);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 flex flex-col gap-3 z-50 md:flex-row md:items-center">
            {/* Mobile: Song Info at Top */}
            <div className="md:hidden flex items-center justify-between w-full">
                <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-white font-bold text-sm truncate">Midnight Dreams</h4>
                    <p className="text-gray-400 text-xs hover:text-white cursor-pointer transition-colors truncate">Luna Echo</p>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <Download size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Desktop: Song Info Left */}
            <div className="hidden md:flex items-center gap-3 min-w-[140px] flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
                </div>
                <div className="flex flex-col min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">Midnight Dreams</h4>
                    <p className="text-gray-400 text-[11px] hover:text-white cursor-pointer transition-colors truncate">Luna Echo</p>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors ml-2">
                    <Heart size={16} />
                </button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-4 flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between w-full max-w-[500px] px-1 gap-2">
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
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform mx-2"
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

                <div className="flex items-center gap-2 w-full pt-2">
                    <span className="hidden md:inline-flex text-xs text-gray-500 font-mono">1:24</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
                        <div
                            className="h-full bg-foreground group-hover:bg-primary transition-colors relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <span className="hidden md:inline-flex text-xs text-gray-500 font-mono">4:05</span>
                </div>
            </div>

            {/* Desktop: Volume & Options Right */}
            <div className="hidden md:flex items-center justify-end gap-3 min-w-[120px] flex-shrink-0">
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Download size={16} />
                </button>
                <div className="flex items-center gap-2 w-24 group">
                    <Volume2 size={16} className="text-gray-400" />
                    <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden">
                        <div className="h-full bg-foreground w-[80%] group-hover:bg-primary transition-colors" />
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>
    );
}

export default PlayerBar;
