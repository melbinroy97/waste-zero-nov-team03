import { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/ui/LoadingButton';

export default function NgoDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [metrics, setMetrics] = useState<Metrics | undefined>();
  const [recycling, setRecycling] = useState<RecyclingCategory[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    alertToast.success({
      title: 'Opportunity created!',
      description: 'Your new volunteer opportunity is now live.',
    });
    
    setIsCreating(false);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">NGO Dashboard</h1>
          <p className="text-muted-foreground">Manage your organization and volunteer opportunities</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="eco-gradient eco-glow">
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
            onCreateNew={() => setIsCreateOpen(true)}
          />
          <UpcomingPickups pickups={pickups} isLoading={isLoading} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RecyclingBreakdown categories={recycling} isLoading={isLoading} />
        </div>
      </div>

      {/* Create Opportunity Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Opportunity</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new volunteer opportunity.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOpportunity} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., Beach Cleanup Initiative" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the volunteer opportunity..."
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Ocean Beach" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills (comma separated)</Label>
              <Input id="skills" placeholder="e.g., Sorting, Driving, Teamwork" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <LoadingButton type="submit" isLoading={isCreating} loadingText="Creating...">
                Create Opportunity
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
