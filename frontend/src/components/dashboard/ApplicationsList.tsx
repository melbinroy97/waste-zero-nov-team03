import { FileText, Building2, Clock } from 'lucide-react';
import type { Application } from '@/types';
import { Pill } from '@/components/ui/Pill';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ApplicationsListProps {
  applications?: Application[];
  isLoading?: boolean;
}

const statusStyles = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'default',
} as const;

function ApplicationCard({ application }: { application: Application }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 rounded-lg bg-primary/10 p-3">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">
          {application.opportunityTitle}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <Building2 className="h-3 w-3" />
          <span>{application.ngoName}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Pill variant={statusStyles[application.status]} size="sm">
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Pill>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(application.appliedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
      <Skeleton className="h-11 w-11 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function ApplicationsList({ applications, isLoading }: ApplicationsListProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">My Applications</h3>
        {applications && applications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/volunteer/applications')}>
            View all
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <ApplicationSkeleton key={i} />
          ))}
        </div>
      ) : applications && applications.length > 0 ? (
        <div className="space-y-3">
          {applications.slice(0, 3).map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start exploring volunteer opportunities and apply to make a difference!"
          action={
            <Button onClick={() => navigate('/dashboard/volunteer/opportunities')} className="eco-gradient eco-glow">
              Browse Opportunities
            </Button>
          }
        />
      )}
    </div>
  );
}
