// this is the topbar component contains just some icons, n search bar and user avatar
import { Search, User, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarTrigger } from "./sidebar";

export function TopBar() {
    return (
        <div className="w-full h-16 m-0 bg-background/80 border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <div className="min-w-0 flex-1 flex items-center gap-4 p-2 border border-secondary rounded-xl bg-card">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search your library..."
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                    />
                </div>
            </div>
            <div className="flex flex-row items-center gap-4">
               <ThemeToggle />
               <button><Bell className="w-6 h-6 bg-primary text-primary-foreground p-1 rounded-3xl" /></button> 
               <button><User className="bg-accent text-accent-foreground w-8 h-8 p-1 rounded-3xl" /></button>
            </div>
        </div>
    );
}