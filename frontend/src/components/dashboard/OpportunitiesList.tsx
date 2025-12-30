import { Calendar, MapPin, PlusCircle, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Opportunity } from "@/types";
import { format } from "date-fns";

interface OpportunitiesListProps {
  opportunities?: Opportunity[];
  isLoading?: boolean;
  onCreateNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function OpportunityCard({ 
  opportunity, 
  onEdit, 
  onDelete 
}: { 
  opportunity: Opportunity;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h3 className="font-semibold text-lg truncate">{opportunity.title}</h3>
          <Badge variant={opportunity.status === 'Open' ? 'default' : 'secondary'} className="capitalize">
            {opportunity.status}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {opportunity.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {opportunity.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {opportunity.duration ? format(new Date(opportunity.duration), 'MMM d, yyyy') : 'TBD'}
          </div>
        </div>
      </div>

      <div className="flex gap-2 sm:flex-shrink-0">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(opportunity._id || opportunity.id)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(opportunity._id || opportunity.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function OpportunitySkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border bg-card">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}

export function OpportunitiesList({ 
  opportunities, 
  isLoading, 
  onCreateNew,
  onEdit,
  onDelete
}: OpportunitiesListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">My Opportunities</h3>
        {onCreateNew && (
          <Button onClick={onCreateNew} size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <OpportunitySkeleton key={i} />
          ))}
        </div>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <OpportunityCard 
              key={opp._id || opp.id} 
              opportunity={opp} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PlusCircle}
          title="No opportunities yet"
          description="Create your first volunteer opportunity and start making an impact!"
          action={
            onCreateNew && (
              <Button onClick={onCreateNew} className="eco-gradient eco-glow">
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Create Opportunity
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
