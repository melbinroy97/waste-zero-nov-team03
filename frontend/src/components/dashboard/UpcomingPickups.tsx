import { MapPin, Clock, Package, Calendar } from 'lucide-react';
import type { Pickup } from '@/types';
import { Pill } from '@/components/ui/Pill';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

interface UpcomingPickupsProps {
  pickups?: Pickup[];
  isLoading?: boolean;
}

const statusStyles = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'default',
} as const;

function PickupCard({ pickup }: { pickup: Pickup }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 rounded-lg bg-primary/10 p-3">
        <Package className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Pill variant={statusStyles[pickup.status]} size="sm">
            {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
          </Pill>
          <span className="text-xs text-muted-foreground">{pickup.itemsCount} items</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-foreground mb-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{pickup.location}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(pickup.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{pickup.time}</span>
          </div>
        </div>
        {pickup.volunteerName && (
          <p className="text-xs text-muted-foreground mt-1">
            Assigned to: <span className="font-medium">{pickup.volunteerName}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function PickupSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
      <Skeleton className="h-11 w-11 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function UpcomingPickups({ pickups, isLoading }: UpcomingPickupsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Pickups</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <PickupSkeleton key={i} />
          ))}
        </div>
      ) : pickups && pickups.length > 0 ? (
        <div className="space-y-3">
          {pickups.map((pickup) => (
            <PickupCard key={pickup.id} pickup={pickup} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No upcoming pickups"
          description="New pickups will appear here when they're scheduled."
        />
      )}
    </div>
  );
}
