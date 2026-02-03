// Sidebar & Main App layout
// components
import { TopBar } from "./components/ui/TopBar";
import { Hero } from "./components/ui/Hero";

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
        <SidebarContent className="bg-card text-muted w-64">
          <div className="mb-2 flex flex-row items-center gap-2 p-4 rounded-b-lg cursor-pointer">
            <AudioLines className="h-10 w-10 p-1 text-white bg-primary rounded-full" />{" "}
            {/* White logo */}
            <h1 className="text-xl font-bold text-white mt-2">MusicX</h1>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted">
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
            <SidebarGroupLabel className="text-muted">
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
            <SidebarGroupLabel className="text-muted">
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
      <SidebarInset className="p-4 border-t border-muted/20">
        <header>
          <TopBar />
        </header>

        <main>
          <Hero />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout;
