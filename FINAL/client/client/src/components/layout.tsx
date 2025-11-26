import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  LogOut, 
  Plus, 
  Search, 
  Settings, 
  User as UserIcon,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { SettingsDialog } from "@/components/settings-dialog";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useStore();
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold font-display text-primary tracking-tight flex items-center gap-2">
          <LayoutGrid className="w-6 h-6" />
          NoteSpace
        </h1>
      </div>
      
      <div className="px-4 py-2">
        <Button 
          className="w-full justify-start gap-2 shadow-md hover:shadow-lg transition-all" 
          size="lg"
          onClick={() => {
             const event = new CustomEvent('open-new-note');
             window.dispatchEvent(event);
             setIsMobileOpen(false);
          }}
        >
          <Plus className="w-5 h-5" />
          New Note
        </Button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link href="/">
          <Button variant={location === '/' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2 font-medium">
            <LayoutGrid className="w-4 h-4" />
            All Notes
          </Button>
        </Link>
        <Link href="/shared">
          <Button variant={location === '/shared' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2 font-medium text-muted-foreground">
            <UserIcon className="w-4 h-4" />
            Shared with me
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 font-medium text-muted-foreground"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => logout()}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-sidebar-border bg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-md z-50 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <LayoutGrid className="w-6 h-6" />
          NoteSpace
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-sidebar border-r border-sidebar-border w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-border/40">
          <p>Faustorilla, Butalid, Gumisad, Guardario, Lasin, Dayagdag</p>
        </footer>
      </main>
    </div>
  );
}