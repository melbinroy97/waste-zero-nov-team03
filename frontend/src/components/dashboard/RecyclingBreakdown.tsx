import type { RecyclingCategory } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Recycle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface RecyclingBreakdownProps {
  categories?: RecyclingCategory[];
  isLoading?: boolean;
}

function CategoryBar({ category }: { category: RecyclingCategory }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{category.name}</span>
        <span className="text-muted-foreground">
          {category.count.toLocaleString()} ({category.percentage}%)
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${category.percentage}%`,
            backgroundColor: category.color,
          }}
        />
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-2.5 w-full rounded-full" />
    </div>
  );
}

export function RecyclingBreakdown({ categories, isLoading }: RecyclingBreakdownProps) {
  const total = categories?.reduce((sum, cat) => sum + cat.count, 0) || 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recycling Breakdown</h3>
        {!isLoading && total > 0 && (
          <span className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryBar key={category.name} category={category} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Recycle}
          title="No recycling data"
          description="Start recycling to see your breakdown here."
        />
      )}
    </div>
  );
}
