import { Package, Recycle, Clock, Leaf, TrendingUp, TrendingDown } from 'lucide-react';
import type { Metrics } from '@/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsStripProps {
  metrics?: Metrics;
  isLoading?: boolean;
}

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend: number;
  suffix?: string;
}

function MetricItem({ icon: Icon, label, value, trend, suffix }: MetricItemProps) {
  const isPositive = trend >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 card-shadow hover:card-shadow-hover transition-all animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="rounded-lg bg-primary/10 p-1.5">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {suffix && <span className="text-sm text-muted-foreground ml-1">{suffix}</span>}
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            isPositive ? 'text-success' : 'text-destructive'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 card-shadow">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}

export function MetricsStrip({ metrics, isLoading }: MetricsStripProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricItem
        icon={Package}
        label="Total Pickups"
        value={metrics.totalPickups}
        trend={metrics.pickupsTrend}
      />
      <MetricItem
        icon={Recycle}
        label="Items Recycled"
        value={metrics.itemsRecycled}
        trend={metrics.itemsTrend}
      />
      <MetricItem
        icon={Clock}
        label="Volunteer Hours"
        value={metrics.volunteerHours}
        trend={metrics.hoursTrend}
        suffix="hrs"
      />
      <MetricItem
        icon={Leaf}
        label="CO₂ Saved"
        value={metrics.co2Saved}
        trend={metrics.co2Trend}
        suffix="tons"
      />
    </div>
  );
}
