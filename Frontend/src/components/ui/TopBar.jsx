import { Search, User, Bell, Loader2, Download } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarTrigger } from "./sidebar";
import { SearchContext } from "@/Context/SearchContext";
import { useContext, useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

export function TopBar() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  // YouTube Search State
  const [ytResults, setYtResults] = useState([]);
  const [isSearchingYt, setIsSearchingYt] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced YouTube Search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setYtResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingYt(true);
      try {
        const data = await api.searchYouTube(searchQuery);
        setYtResults(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingYt(false);
      }
    }, 600); // Wait 600ms after typing stops

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadClick = async (video) => {
    setShowDropdown(false);
    setSearchQuery("");

    try {
      alert(`Starting download for: ${video.title}. This may take a minute...`);
      // Call the API
      await api.downloadYouTube(video.url);
      alert("Download complete! Refreshing library...");

      //a way to tell the library to refresh.
      window.dispatchEvent(new Event('library-updated'));
    } catch (error) {
      console.error(error);
      alert("Failed to download from YouTube.");
    }
  };

  return (
    <div className="w-full h-16 m-0 bg-background/80 border-b border-border flex items-center justify-between px-4 z-50 relative">
      <div
        className="flex items-center gap-3 w-full md:w-auto relative"
        ref={dropdownRef}
      >
        <div className="md:hidden">
          <SidebarTrigger />
        </div>

        {/* SEARCH INPUT */}
        <div className="min-w-0 flex-1 flex items-center gap-4 p-2 border border-secondary rounded-xl bg-card relative z-50">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your library or YouTube..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          {isSearchingYt && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* YOUTUBE DROPDOWN */}
        {showDropdown && ytResults.length > 0 && (
          <div className="absolute top-14 left-0 w-full md:w-[450px] bg-card border border-secondary rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px] overflow-y-auto">
            <div className="p-2 text-xs font-semibold text-muted-foreground border-b border-secondary bg-background/50 sticky top-0 backdrop-blur-md">
              YouTube Results (Click to Download)
            </div>
            {ytResults.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-3 hover:bg-accent transition-colors border-b border-secondary/50 last:border-0 cursor-pointer"
                onClick={() => handleDownloadClick(video)}
              >
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="text-sm font-medium text-foreground truncate">
                    {video.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {video.uploader}
                  </span>
                </div>
                <button className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex-shrink-0">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row items-center gap-4">
        <ThemeToggle />
        <button>
          <Bell className="w-6 h-6 bg-primary text-primary-foreground p-1 rounded-3xl" />
        </button>
        <button>
          <User className="bg-accent text-accent-foreground w-8 h-8 p-1 rounded-3xl" />
        </button>
      </div>
    </div>
  );
}
