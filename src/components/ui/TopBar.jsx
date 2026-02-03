// this is the topbar component contains just some icons, n search bar and user avatar
import { Search, User, Bell } from "lucide-react";


export function TopBar() {
    return (
        <div className="w-full h-16 m-0 bg-glass border-border flex items-center justify-between px-4">
            <div className="w-1/2 flex bg-glass items-center gap-4 p-2 border border-secondary rounded-xl">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search your library..."
                    className="w-full bg-background text-sm text-muted placeholder:text-muted-foreground  "
                />
            </div>
            <div className="flex flex-row items-center gap-4">
               <button><Bell className="w-6 h-6 bg-primary p-1 rounded-3xl" /></button> 
                <button><User className="bg-accent w-8 h-8 p-1 rounded-3xl" /></button>
            </div>
        </div>
    );
}
     