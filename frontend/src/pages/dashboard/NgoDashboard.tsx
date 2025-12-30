import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { MetricsStrip } from '@/components/dashboard/MetricsStrip';
import { OpportunitiesList } from '@/components/dashboard/OpportunitiesList';
import { UpcomingPickups } from '@/components/dashboard/UpcomingPickups';
import { RecyclingBreakdown } from '@/components/dashboard/RecyclingBreakdown';
import { getOpportunities, getUpcomingPickups, getMetrics, getRecyclingBreakdown } from '@/lib/api';
import { alertToast } from '@/components/ui/AlertToast';
import type { Opportunity, Pickup, Metrics, RecyclingCategory } from '@/types';

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [metrics, setMetrics] = useState<Metrics | undefined>();
  const [recycling, setRecycling] = useState<RecyclingCategory[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [opps, picks, mets, recy] = await Promise.all([
          getOpportunities(),
          getUpcomingPickups(),
          getMetrics(),
          getRecyclingBreakdown(),
        ]);
        setOpportunities(opps);
        setPickups(picks);
        setMetrics(mets);
        setRecycling(recy);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        alertToast.error({
          title: 'Failed to load data',
          description: 'Please try refreshing the page.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateClick = () => {
    navigate('/dashboard/ngo/opportunities/new');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">NGO Dashboard</h1>
          <p className="text-muted-foreground">Manage your organization and volunteer opportunities</p>
        </div>
        <Button onClick={handleCreateClick} className="eco-gradient eco-glow">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Opportunity
        </Button>
      </div>

      {/* Metrics Strip */}
      <MetricsStrip metrics={metrics} isLoading={isLoading} />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard isLoading={isLoading} />
          <OpportunitiesList
            opportunities={opportunities}
            isLoading={isLoading}
            onCreateNew={handleCreateClick}
          />
          <UpcomingPickups pickups={pickups} isLoading={isLoading} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RecyclingBreakdown categories={recycling} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
