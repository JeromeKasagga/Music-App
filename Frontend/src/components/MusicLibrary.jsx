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

import { api } from "../lib/api";
function MusicLibrary() {
  // State to hold songs from Django
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext);

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

  return (
    <div className="p-8 pt-0 text-white ml-0">
      <div className="flex justify-between items-center mb-6 max-w-[1040px]">
        <h2 className="text-xl font-bold">Your Library</h2>
        <UploadButton onUploadSuccess={fetchSongs} />
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
              {songs.map((song, index) => (
                <TableRow
                  key={song.id}
                  onClick={() =>playSong(song, songs)}
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
};

export default MusicLibrary;
