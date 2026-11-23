import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Music,
  Play,
  Pause, // <-- Added this
  MoreHorizontal,
  Download,
  Trash2,
} from "lucide-react";
import EmptyState from "./ui/EmptyState";
import UploadButton from "./ui/UploadButton";
import { PlayerContext } from "../Context/PlayerContext";
import { SearchContext } from "@/Context/SearchContext";
import { api } from "../lib/api";

function MusicLibrary() {
  // State to hold songs from Django
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext);
  const fileInputRef = useRef(null);
  const { searchQuery } = useContext(SearchContext);

  // function to fetch songs
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const data = await api.getSongs();
      setSongs(data);
      setError(null);
    } catch (err) {
      setError("Failed to load songs, are you logged in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();

    // Listen for the custom event to refresh the list
    const handleUpdate = () => fetchSongs();
    window.addEventListener("library-updated", handleUpdate);

    return () => window.removeEventListener("library-updated", handleUpdate);
  }, []);

  // Hero buttons listener
  useEffect(() => {
    const handlePlayAll = () => {
      if (songs.length > 0) playSong(songs[0], songs);
    };
    const handleUpload = () => {
      if (fileInputRef.current) fileInputRef.current.click();
    };

    window.addEventListener("trigger-play-all", handlePlayAll);
    window.addEventListener("trigger-upload", handleUpload);

    return () => {
      window.removeEventListener("trigger-play-all", handlePlayAll);
      window.removeEventListener("trigger-upload", handleUpload);
    };
  }, [songs, playSong]);

  // Loading screen while fetching
  if (loading) {
    return <div className="p-8 text-white">Loading Your music...</div>;
  }

  // Error if it fails
  if (error) {
    return (
      <div className="p-8 pt-0 text-white ml-0">
        <div className="flex justify-between items-center mb-6 max-w-[1040px]">
          <h2 className="text-xl font-bold">Your Library</h2>
          <UploadButton onUploadSuccess={fetchSongs} />
        </div>
        <div className="max-w-[1040px] p-8 border border-red-500/20 bg-red-500/10 rounded-xl text-red-400">
          {error}
        </div>
      </div>
    );
  }

  // filter songs based on search query
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // function to handle Youtube downloads
  const handleYouTubeDownload = async () => {
    const url = prompt("Enter YouTube URL:");
    if (!url) return;

    try {
      await api.downloadYouTube(url);
      alert("YouTube song downloaded and added to your library!");
      fetchSongs(); // Refresh the list
    } catch (error) {
      console.error(error);
      alert("Failed to download. Check the console.");
    }
  };

    return (
    <div className="p-4 md:p-8 pt-0 text-white ml-0">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 max-w-[1040px]">
        <h2 className="text-xl font-bold">Your Library</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleYouTubeDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 font-medium rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"></polygon>
            </svg>
            <span>YouTube</span>
          </button>
          <div className="w-full sm:w-auto">
            <UploadButton onUploadSuccess={fetchSongs} />
          </div>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="max-w-[1040px]">
          <EmptyState title="Your Library" message="Upload songs to get started" />
        </div>
      ) : (
        <>
          {/* =========================================
              DESKTOP TABLE VIEW (Hidden on mobile)
              ========================================= */}
          <div className="hidden lg:block max-w-[1040px] bg-card/50 rounded-xl overflow-hidden border border-white/5">
            <Table>
              <TableHeader className="bg-white/5 hover:bg-white/5">
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="w-[50px] text-gray-400">#</TableHead>
                  <TableHead className="text-gray-400">TITLE</TableHead>
                  <TableHead className="text-gray-400">ARTIST</TableHead>
                  <TableHead className="text-gray-400">ALBUM</TableHead>
                  <TableHead className="text-right text-gray-400 w-[100px]">DURATION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSongs.map((song, index) => (
                  <TableRow
                    key={song.id}
                    onClick={() => playSong(song, filteredSongs)}
                    className={`group border-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
                      currentSong?.id === song.id ? "bg-white/5" : ""
                    }`}
                  >
                    <TableCell className="font-medium text-gray-400 group-hover:text-white w-[50px]">
                      <span className={currentSong?.id === song.id ? "hidden" : "group-hover:hidden"}>
                        {index + 1}
                      </span>
                      <div className={`${currentSong?.id === song.id ? "block" : "hidden group-hover:block"} text-primary`}>
                        {currentSong?.id === song.id && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <Music className="w-5 h-5 text-white/70" />
                        </div>
                        <div className={`font-medium truncate ${
                          currentSong?.id === song.id ? "text-primary" : "text-foreground group-hover:text-primary"
                        }`}>
                          {song.title || "Unknown title"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-400 truncate">
                      {song.artist || "Unknown artist"}
                    </TableCell>

                    <TableCell className="text-gray-400 truncate">
                      {song.album || "Single"}
                    </TableCell>

                    <TableCell className="text-right text-gray-400 font-mono text-sm w-[100px]">
                      <div className="flex items-center justify-end gap-2">
                        <span>{song.duration || "0:00"}</span>
                        
                        {/* 3-Dot Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-card border-white/10">
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={(e) => {
                                e.stopPropagation();
                                const link = document.createElement("a");
                                link.href = song.file_url;
                                link.download = `${song.title}.mp3`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}>
                              <Download className="w-4 h-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 focus:text-red-500" onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm("Delete this song?")) {
                                  await api.deleteSong(song.id);
                                  fetchSongs();
                                }
                            }}>
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* =========================================
              MOBILE LIST VIEW (Hidden on desktop)
              ========================================= */}
          <div className="lg:hidden flex flex-col gap-2 max-w-[1040px]">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song, filteredSongs)}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  currentSong?.id === song.id ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                {/* Left Side: Cover & Text */}
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  {/* Album Art Placeholder */}
                  <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-white/50" />
                  </div>
                  
                  {/* Title & Artist */}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-semibold truncate ${
                      currentSong?.id === song.id ? "text-primary" : "text-white"
                    }`}>
                      {song.title || "Unknown title"}
                    </span>
                    <span className="text-xs text-gray-400 truncate mt-0.5">
                      {song.artist || "Unknown artist"}
                    </span>
                  </div>
                </div>

                {/* Right Side: Menu Only */}
                <div className="flex items-center flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="p-2 text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-card border-white/10">
                      <DropdownMenuItem className="cursor-pointer gap-2" onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement("a");
                          link.href = song.file_url;
                          link.download = `${song.title}.mp3`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                      }}>
                        <Download className="w-4 h-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 focus:text-red-500" onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("Delete this song?")) {
                            await api.deleteSong(song.id);
                            fetchSongs();
                          }
                      }}>
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MusicLibrary;

