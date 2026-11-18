import React, { createContext, useState, useRef, useEffect } from 'react';

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    
    // NEW: Keep track of the queue and current index
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isShuffle, setIsShuffle] = useState(false);

    const audioRef = useRef(new Audio());

    // Play a specific song (and set the queue)
    const playSong = (song, songList) => {
        // If we pass a list of songs, set it as the queue
        if (songList) {
            setQueue(songList);
            setCurrentIndex(songList.findIndex(s => s.id === song.id));
        } else {
            // If no list passed, try to find it in the existing queue
            const index = queue.findIndex(s => s.id === song.id);
            if (index !== -1) setCurrentIndex(index);
        }

        if (currentSong?.id === song.id) {
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

    // NEW: Next Song logic
    const nextSong = () => {
        if (queue.length === 0) return;

        let nextIndex;
        if (isShuffle) {
            // Pick a random song that isn't the current one
            nextIndex = Math.floor(Math.random() * queue.length);
            if (queue.length > 1) {
                while (nextIndex === currentIndex) {
                    nextIndex = Math.floor(Math.random() * queue.length);
                }
            }
        } else {
            // Just go to the next song in the list (loop back to start if at the end)
            nextIndex = (currentIndex + 1) % queue.length;
        }

        playSong(queue[nextIndex]);
    };

    // NEW: Previous Song logic
    const prevSong = () => {
        if (queue.length === 0) return;
        let prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        playSong(queue[prevIndex]);
    };

    const toggleShuffle = () => setIsShuffle(!isShuffle);

    // Audio event listener for track ending
    useEffect(() => {
        const audio = audioRef.current;
        
        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };

        const setAudioData = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            // When a song ends, automatically play the next one
            nextSong();
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentIndex, queue, isShuffle]); // Needs these dependencies to update nextSong correctly

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            progress,
            duration,
            playSong,
            togglePlay,
            nextSong,
            prevSong,
            toggleShuffle,
            isShuffle
        }}>
            {children}
        </PlayerContext.Provider>
    );
}