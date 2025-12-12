import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  PlusCircle,
  Users,
} from 'lucide-react';

const volunteerItems = [
  { to: '/dashboard/volunteer', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/volunteer/opportunities', icon: Search, label: 'Browse' },
  { to: '/dashboard/volunteer/applications', icon: FileText, label: 'Applied' },
  { to: '/dashboard/volunteer/messages', icon: MessageSquare, label: 'Messages' },
];

const ngoItems = [
  { to: '/dashboard/ngo', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/ngo/opportunities', icon: PlusCircle, label: 'Manage' },
  { to: '/dashboard/ngo/volunteers', icon: Users, label: 'Volunteers' },
  { to: '/dashboard/ngo/messages', icon: MessageSquare, label: 'Messages' },
];

export function BottomNav() {
  const { user } = useAuth();
  const items = user?.role === 'ngo' ? ngoItems : volunteerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
