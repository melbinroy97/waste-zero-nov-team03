import React, { useEffect, useState } from 'react';
import { getAllPickups, updatePickupStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

const AdminPickups = () => {
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPickups = async () => {
    try {
      const data = await getAllPickups();
      setPickups(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updatePickupStatus(id, newStatus);
      // Optimistic update
      setPickups(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <div className="p-8">Loading pickups...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Pickups</h1>
          <p className="text-muted-foreground">Oversee and update status of waste collection requests.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {pickups.length === 0 ? (
          <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
            No pickups found.
          </div>
        ) : (
          pickups.map((pickup) => (
            <div key={pickup._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl bg-card shadow-sm gap-4">
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        pickup.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                        pickup.status === 'Pending' || pickup.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                        {pickup.status}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                         {pickup.pickupDate ? format(new Date(pickup.pickupDate), 'PPP') : 'No Date'}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pickup.timeSlot}
                    </span>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium text-foreground">{pickup.address}, {pickup.city}</p>
                        <p className="text-sm text-muted-foreground">
                            Waste Types: {pickup.wasteTypes?.join(', ') || 'General'}
                        </p>
                    </div>
                </div>
                
                {pickup.user && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-8">
                        <UserIcon className="h-3 w-3" />
                        Requested by {pickup.user.name || 'User'} ({pickup.user.email})
                    </div>
                )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4 md:mt-0">
                    {pickup.status !== 'Completed' && (
                        <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                            onClick={() => handleStatusUpdate(pickup._id, 'Completed')}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                        </Button>
                    )}
                    {pickup.status !== 'Cancelled' && pickup.status !== 'Completed' && (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive border-destructive hover:bg-destructive/5 w-full sm:w-auto"
                            onClick={() => handleStatusUpdate(pickup._id, 'Cancelled')}
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    };

export default AdminPickups;
