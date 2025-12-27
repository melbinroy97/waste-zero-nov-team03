import { PlusCircle, MapPin, Calendar, Users, Clock } from 'lucide-react';
import type { Opportunity } from '@/types';
import { Pill } from '@/components/ui/Pill';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';

interface OpportunitiesListProps {
  opportunities?: Opportunity[];
  isLoading?: boolean;
  onCreateNew?: () => void;
}

const statusStyles = {
  open: 'success',
  'in-progress': 'warning',
  closed: 'default',
} as const;

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h4 className="text-sm font-medium text-foreground">{opportunity.title}</h4>
          <Pill variant={statusStyles[opportunity.status]} size="sm">
            {opportunity.status.replace('-', ' ').charAt(0).toUpperCase() + opportunity.status.slice(1)}
          </Pill>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
          {opportunity.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {opportunity.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(opportunity.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {opportunity.applicationsCount} applicants
          </span>
        </div>
      </div>
      <div className="flex gap-2 sm:flex-shrink-0">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </div>
    </div>
  );
}

function OpportunitySkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border bg-card">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-14" />
      </div>
    </div>
  );
}

export function OpportunitiesList({ opportunities, isLoading, onCreateNew }: OpportunitiesListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">My Opportunities</h3>
        <Button onClick={onCreateNew} size="sm" className="eco-gradient eco-glow">
          <PlusCircle className="h-4 w-4 mr-1.5" />
          Create New
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <OpportunitySkeleton key={i} />
          ))}
        </div>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PlusCircle}
          title="No opportunities yet"
          description="Create your first volunteer opportunity and start making an impact!"
          action={
            <Button onClick={onCreateNew} className="eco-gradient eco-glow">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Opportunity
            </Button>
          }
        />
      )}
    </div>
  );
}
