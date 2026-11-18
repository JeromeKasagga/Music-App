import React, { createContext, useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(new Audio());

    // Play a specific song
    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            // If it's the same song, just toggle play/pause
            togglePlay();
            return;
        }
        
        setCurrentSong(song);
        audioRef.current.src = song.file_url;
        audioRef.current.play();
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Update progress bar as the song plays
    useEffect(() => {
        const audio = audioRef.current;
        
        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };

        const setAudioData = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, []);

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            progress,
            duration,
            playSong,
            togglePlay
        }}>
            {children}
        </PlayerContext.Provider>
    );
}