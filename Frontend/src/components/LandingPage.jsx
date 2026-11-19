import React, { useState } from 'react';
import { Music, UploadCloud, Play, Download, ShieldCheck, ArrowRight } from 'lucide-react';
import Login from './Login';

export default function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);

    // If they clicked "Log In", show the login screen 
    if (showLogin) {
        return <Login onBack={() => setShowLogin(false)} />;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30">
            
            {/* NAVBAR */}
            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Music className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">MusicX</span>
                    </div>
                    <button 
                        onClick={() => setShowLogin(true)}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Your Personal Cloud Music Library
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
                    Your Music. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                        Your Cloud.
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
                    Upload your tracks, stream them from anywhere, and download them for offline listening. No subscriptions, no ads—just your music.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => setShowLogin(true)}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all"
                    >
                        Start Listening <ArrowRight className="w-4 h-4" />
                    </button>
                    <a 
                        href="https://github.com/JeromeKasagga/Music-App" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-full font-semibold transition-all"
                    >
                        View Source
                    </a>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                            <UploadCloud className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Bring Your Own</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Upload MP3s directly to your private cloud bucket. Keep your library fully yours.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Stream Anywhere</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Instant playback on any device. No data-heavy downloads required to hit play.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">High Quality</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            We preserve your original audio quality so it sounds exactly as intended.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Offline Ready</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Save tracks to your device for when you're off the grid. Zero data required.
                        </p>
                    </div>
                </div>
            </section>

            {/* SIMPLE FOOTER */}
            <footer className="border-t border-white/5 py-8 mt-12">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} MusicX. Built for personal use.
                    </p>
                    <div className="flex items-center gap-4 text-gray-500">
                        <span className="text-sm">React + Django + Supabase</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}