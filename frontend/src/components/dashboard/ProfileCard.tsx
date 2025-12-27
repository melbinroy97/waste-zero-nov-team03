import { MapPin, Mail, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pill } from '@/components/ui/Pill';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileCardProps {
  isLoading?: boolean;
}

export function ProfileCard({ isLoading }: ProfileCardProps) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 card-shadow animate-fade-in">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    );
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow animate-fade-in hover:card-shadow-hover transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-primary/10">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-foreground truncate">{user?.name}</h2>
            <Pill variant={user?.role === 'ngo' ? 'primary' : 'success'}>
              {user?.role === 'ngo' ? 'NGO' : 'Volunteer'}
            </Pill>
          </div>

          {user?.role === 'ngo' && user?.organizationName && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate">{user.organizationName}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{user?.email}</span>
          </div>

          {user?.location && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{user.location}</span>
            </div>
          )}
        </div>
      </div>

      {user?.skills && user.skills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill) => (
              <Pill key={skill} variant="outline" size="sm">
                {skill}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {user?.bio && (
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
      )}
    </div>
  );
}
