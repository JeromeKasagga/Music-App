import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Music, Play, Clock, MoreHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "./ui/EmptyState";
import UploadButton from "./ui/UploadButton";
import { useContext } from "react";
import { PlayerContext } from "../Context/PlayerContext";
import { SearchContext } from "@/Context/SearchContext";

import { api } from "../lib/api";
function MusicLibrary() {
  // State to hold songs from Django
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext);
  const { searchQuery } = useContext(SearchContext);

  // fetch the songs when the component loads
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // call the js api
        const data = await api.getSongs();
        setSongs(data);
      } catch (err) {
        setError("Failed to load songs, are you logged in");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // function to fetch songs
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const data = await api.getSongs();
      setSongs(data);
    } catch (err) {
      setError("Failed to load songs, are you logged in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

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
          <UploadButton />
        </div>
        <div className="max-w-[1040px] p-8 border border-red-500/20 bg-red-500/10 rounded-xl text-red-400">
          {error}
        </div>
      </div>
    );
  }

  // filter songs
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
      // loading state here later
      await api.downloadYouTube(url);
      alert("YouTube song downloaded and added to your library!");
      fetchSongs(); // Refresh the list
    } catch (error) {
      console.error(error);
      alert("Failed to download. Check the console.");
    }
  };

  return (
    <div className="p-8 pt-0 text-white ml-0">
      <div className="flex justify-between items-center mb-6 max-w-[1040px]">
        <h2 className="text-xl font-bold">Your Library</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleYouTubeDownload}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 font-medium rounded-full transition-colors"
          >
            {/* Using a simple SVG for YouTube icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon
                points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                fill="white"
              ></polygon>
            </svg>
            <span>YouTube</span>
          </button>
          <UploadButton onUploadSuccess={fetchSongs} />
        </div>
      </div>

      {songs.length === 0 ? (
        // If there are no songs, show this:
        <div className="max-w-[1040px]">
          <EmptyState
            title="Your Library"
            message="Upload songs to get started"
          />
        </div>
      ) : (
        // If there ARE songs, show the Table:
        <div className="max-w-[1040px] bg-card/50 rounded-xl overflow-hidden border border-white/5">
          <Table>
            <TableHeader className="bg-white/5 hover:bg-white/5">
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="w-[50px] text-gray-400">#</TableHead>
                <TableHead className="text-gray-400">TITLE</TableHead>
                <TableHead className="text-gray-400">ARTIST</TableHead>
                <TableHead className="text-gray-400 hidden md:table-cell">
                  ALBUM
                </TableHead>
                <TableHead className="text-right text-gray-400">
                  DURATION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSongs.map((song, index) => (
                <TableRow
                  key={song.id}
                  onClick={() => playSong(song, songs)}
                  className="group border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <TableCell className="font-medium text-gray-400 group-hover:text-white">
                    <span className="group-hover:hidden">{index + 1}</span>
                    <Play
                      className="w-4 h-4 hidden group-hover:block text-primary"
                      fill="currentColor"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}
                      >
                        <Music className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {song.title || "Unknown title"}
                        </div>
                        <div className="text-xs text-gray-500 md:hidden">
                          {song.artist || "Unknown artist"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {song.artist || "Unknown artist"}
                  </TableCell>
                  <TableCell className="text-gray-400 hidden md:table-cell">
                    {song.album}
                  </TableCell>
                  <TableCell className="text-right text-gray-400 font-mono text-sm">
                    <div className="flex items-center justify-end gap-4">
                      <span>{song.duration}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement("a");
                          link.href = song.file_url;
                          link.download = `${song.title}.mp3`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition-all"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default MusicLibrary;
