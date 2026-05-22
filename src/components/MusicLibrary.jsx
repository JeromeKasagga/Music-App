import React from 'react';
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

// Mock data similar to the structure in "Most Listened" but for the library
const librarySongs = [
    { id: "1", title: "Midnight Dreams", artist: "Luna Echo", album: "Starlight", duration: "4:05" },
    { id: "2", title: "Neon Nights", artist: "Synthwave Collective", album: "Retro Future", duration: "3:18" },
    { id: "3", title: "Ocean Waves", artist: "Coastal Beats", album: "Tides", duration: "5:12" },
    { id: "4", title: "Electric Soul", artist: "The Groove Masters", album: "Voltage", duration: "4:27" },
    { id: "5", title: "Sunset Boulevard", artist: "City Lights", album: "Night Drive", duration: "3:45" },
    { id: "6", title: "Cosmic Journey", artist: "Space Cadets", album: "Voyager", duration: "6:01" },
];

function MusicLibrary() {
    if (librarySongs.length === 0) {
        return (
            <div className="p-8 text-white ml-0">
                <EmptyState title="Your Library" message="Upload songs to get started" />
            </div>
        );
    }

    return (
        <div className="p-8 pt-0 text-white ml-0">
            <div className="flex justify-between items-center mb-6 max-w-[1040px]">
                <h2 className="text-xl font-bold">Your Library</h2>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Music
                </Button>
            </div>

            <div className="max-w-[1040px] bg-card/50 rounded-xl overflow-hidden border border-white/5">
                <Table>
                    <TableHeader className="bg-white/5 hover:bg-white/5">
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="w-[50px] text-gray-400">#</TableHead>
                            <TableHead className="text-gray-400">TITLE</TableHead>
                            <TableHead className="text-gray-400">ARTIST</TableHead>
                            <TableHead className="text-gray-400 hidden md:table-cell">ALBUM</TableHead>
                            <TableHead className="text-right text-gray-400">DURATION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {librarySongs.map((song, index) => (
                            <TableRow
                                key={song.id}
                                className="group border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <TableCell className="font-medium text-gray-400 group-hover:text-white">
                                    <span className="group-hover:hidden">{index + 1}</span>
                                    <Play className="w-4 h-4 hidden group-hover:block text-primary" fill="currentColor" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
                                            <Music className="w-5 h-5 text-white/70" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">{song.title}</div>
                                            <div className="text-xs text-gray-500 md:hidden">{song.artist}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-400">{song.artist}</TableCell>
                                <TableCell className="text-gray-400 hidden md:table-cell">{song.album}</TableCell>
                                <TableCell className="text-right text-gray-400 font-mono text-sm">
                                    <div className="flex items-center justify-end gap-4">
                                        <span>{song.duration}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`Downloading ${song.title}`);
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
        </div>
    );
}

function UploadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}

export default MusicLibrary;
