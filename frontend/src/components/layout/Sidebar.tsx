import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  PlusCircle,
  Users,
  Leaf,
  User,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const volunteerNavItems = [
  { to: '/dashboard/volunteer', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/volunteer/opportunities', icon: Search, label: 'Browse Opportunities' },


  { to: '/dashboard/volunteer/matches', icon: Leaf, label: 'Matched Opportunities' },

  { to: '/dashboard/volunteer/applications', icon: FileText, label: 'My Applications' },
  { to: '/dashboard/volunteer/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/dashboard/volunteer/schedule', icon: Calendar, label: 'My Schedule' },
  { to: '/dashboard/volunteer/profile', icon: User, label: 'My Profile' },
  { to: '/dashboard/volunteer/settings', icon: Settings, label: 'Settings' },
];

const ngoNavItems = [
  { to: '/dashboard/ngo', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/ngo/opportunities', icon: PlusCircle, label: 'My Opportunities' },
  { to: '/dashboard/ngo/volunteers', icon: Users, label: 'Volunteers' },
  { to: '/dashboard/ngo/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/dashboard/ngo/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/dashboard/ngo/profile', icon: User, label: 'My Profile' },
  { to: '/dashboard/ngo/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  
  const navItems = user?.role === 'NGO' ? ngoNavItems : volunteerNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border',
          'transform transition-transform duration-200 ease-in-out',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">WasteZero</span>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => onClose()}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Eco Impact</span>
            </div>
            <p className="text-xs text-muted-foreground">
              You've helped save 1.8 tons of CO₂ this month!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
