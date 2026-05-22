// Sidebar & Main App layout
// components
import { TopBar } from "./components/ui/TopBar";
import { Hero } from "./components/ui/Hero";
import MostListened from "./components/ui/MostListened";
import MusicLibrary from "./components/MusicLibrary";
import PlayerBar from "./components/PlayerBar";

// Sidebar
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

// icons
import {
  Home,
  Upload,
  Compass,
  Music,
  History,
  FolderOpen,
  MicVocal,
  Album,
  AudioLines,
} from "lucide-react";

function AppLayout() {
  return (
    <SidebarProvider>
      {/* The Sidebar */}
      <Sidebar>
        <SidebarContent className="bg-card text-foreground w-64">
          <div className="mb-2 flex flex-row items-center gap-2 p-4 rounded-b-lg cursor-pointer">
            <AudioLines className="h-10 w-10 p-1 text-white bg-primary rounded-full" />{" "}
            {/* White logo */}
            <h1 className="text-xl font-bold text-white mt-2">MusicX</h1>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              Recommended
            </SidebarGroupLabel>
            <SidebarGroupContent className="pl-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Upload />
                    <span>Upload Music</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Compass />
                    <span>Explore</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              My Library
            </SidebarGroupLabel>
            <SidebarGroupContent className="pl-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <History />
                    <span>Recently Played</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <MicVocal />
                    <span>Artists</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Album />
                    <span>Albums</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Music />
                    <span>Songs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              Playlists
            </SidebarGroupLabel>
            <SidebarGroupContent className="pl-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FolderOpen />
                    <span>My Playlists</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* The main app layout */}
      <SidebarInset className="bg-background h-screen overflow-hidden flex flex-col relative">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md">
          <TopBar />
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto relative pb-[100px]">
          {/* Sticky Hero */}
          <div className="sticky top-0 z-20 bg-background pb-4">
            <Hero />
          </div>

          {/* Scrollable Content Layers */}
          <div className="relative z-10 bg-background min-h-screen">
            <MostListened />
            <MusicLibrary />
          </div>
        </main>

        <PlayerBar />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout;
