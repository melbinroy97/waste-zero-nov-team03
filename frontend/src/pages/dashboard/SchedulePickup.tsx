import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon, History } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const WASTE_TYPES = [
  "Plastic", "Glass", "Electronic Waste", "Other",
  "Paper", "Metal", "Organic Waste"
];

const TIME_SLOTS = [
  "Morning (8AM - 12PM)",
  "Afternoon (12PM - 4PM)",
  "Evening (4PM - 8PM)"
];

export default function SchedulePickup() {
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState(false);
  const [pickups, setPickups] = useState<any[]>([]);

  // Form State
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPickups();
  }, [token]);

  const fetchPickups = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:2000/api/pickups/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPickups(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !city || !date || !timeSlot || selectedWasteTypes.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:2000/api/pickups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          address,
          city,
          pickupDate: date,
          timeSlot,
          wasteTypes: selectedWasteTypes,
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Pickup scheduled successfully!");
        setAddress("");
        setCity("");
        setDate(undefined);
        setTimeSlot("");
        setSelectedWasteTypes([]);
        setNotes("");
        setActiveTab("history");
        fetchPickups();
      } else {
        toast.error(data.message || "Failed to schedule pickup");
      }
    } catch (err) {
      toast.error("Error scheduling pickup");
    } finally {
      setLoading(false);
    }
  };

  const toggleWasteType = (type: string) => {
    setSelectedWasteTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Schedule Pickup</h2>
        <p className="text-muted-foreground">Request waste collection and manage your pickups</p>
      </div>

      <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="new">Schedule New Pickup</TabsTrigger>
          <TabsTrigger value="history">Pickup History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Waste Collection</CardTitle>
              <p className="text-sm text-muted-foreground">Fill in the details to schedule a pickup for your recyclable waste</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handeSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input 
                    placeholder="Enter your street address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input 
                      placeholder="Enter your city" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                  <Label>Pickup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                   <Label>Preferred Time Slot</Label>
                   <Select onValueChange={setTimeSlot} value={timeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                   </Select>
                </div>

                <div className="space-y-2">
                  <Label>Waste Types</Label>
                  <p className="text-xs text-muted-foreground mb-3">Select the types of waste you want to recycle</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {WASTE_TYPES.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={type} 
                          checked={selectedWasteTypes.includes(type)}
                          onCheckedChange={() => toggleWasteType(type)}
                        />
                        <label
                          htmlFor={type}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea 
                    placeholder="Any special instructions or information about your waste" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto md:ml-auto block" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Scheduling...</> : "Schedule Pickup"}
                </Button>

              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
             <CardHeader>
                <CardTitle>Your Pickup History</CardTitle>
                <p className="text-sm text-muted-foreground">View and manage all your scheduled pickups</p>
             </CardHeader>
             <CardContent>
                {pickups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                     <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
                     <p className="text-muted-foreground">You haven't scheduled any pickups yet.</p>
                     <Button variant="link" onClick={() => setActiveTab("new")}>Schedule your first pickup</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {pickups.map(pickup => (
                        <div key={pickup._id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg items-start md:items-center gap-4">
                           <div>
                              <div className="font-semibold">{format(new Date(pickup.pickupDate), "PPP")} - {pickup.timeSlot}</div>
                              <div className="text-sm text-muted-foreground">{pickup.address}, {pickup.city}</div>
                              <div className="text-xs mt-1 text-muted-foreground flex gap-2 flex-wrap">
                                 {pickup.wasteTypes.map((t: string) => (
                                    <span key={t} className="bg-secondary px-2 py-0.5 rounded-full">{t}</span>
                                 ))}
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className={cn(
                                 "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                 pickup.status === 'Pending' && "bg-yellow-100 text-yellow-800",
                                 pickup.status === 'Scheduled' && "bg-blue-100 text-blue-800",
                                 pickup.status === 'Completed' && "bg-green-100 text-green-800",
                                 pickup.status === 'Cancelled' && "bg-red-100 text-red-800",
                              )}>
                                 {pickup.status}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
                )}
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
