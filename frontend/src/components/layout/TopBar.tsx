import { useEffect, useState } from 'react';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pill } from '@/components/ui/Pill';
import { io } from "socket.io-client";
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io("http://localhost:2000", {
      auth: { token },
    });

    socket.on("newMessage", (msg: any) => {
      // Don't show notification if we are the sender (optional check)
      if (msg.senderId !== user?.id) {
          setHasNotification(true);
          toast("New message received", {
            action: {
              label: "View",
              onClick: () => window.location.href = "/dashboard/volunteer/messages"
            },
          });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xl font-bold text-primary">WasteZero</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications" onClick={() => setHasNotification(false)}>
          <Bell className="h-5 w-5" />
          {hasNotification && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name}</span>
                <Pill variant={user?.role === 'NGO' ? 'primary' : user?.role === 'ADMIN' ? 'warning' : 'success'} size="sm">
                  {user?.role === 'NGO' ? 'NGO' : user?.role === 'ADMIN' ? 'Admin' : 'Volunteer'}
                </Pill>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
