import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Truck, FileText, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("Authentication required");
        return;
    }
    
    // Mapping report types to endpoints and filenames
    const reportConfig: Record<string, { url: string, filename: string }> = {
        "Users Report": { url: `${API_URL}/admin/users`, filename: "users_report.csv" },
        "Pickups Report": { url: `${API_URL}/pickups`, filename: "pickups_report.csv" },
        "Opportunities Report": { url: `${API_URL}/admin/opportunities`, filename: "opportunities_report.csv" },
        "Full Activity Report": { url: `${API_URL}/admin/logs`, filename: "activity_report.csv" }
    };

    const config = reportConfig[type];
    if (!config) {
        toast.error(`Unknown report type: ${type}`);
        return;
    }

    toast.info(`Generating ${type}...`);

    try {
        const res = await fetch(config.url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch report data");

        const data = await res.json();
        
        // Ensure data is array (handle wrapped response like { data: [...] } or direct array)
        let arrayData: any[] = [];
        if (Array.isArray(data)) {
            arrayData = data;
        } else if (data && Array.isArray(data.data)) {
            arrayData = data.data;
        }
        
        if (arrayData.length === 0) {
             toast.warning("No data found to generate report.");
             return;
        }

        // Convert to CSV
        const headers = Object.keys(arrayData[0]).join(",");
        const csvRows = arrayData.map((row: any) => {
            return Object.values(row).map((val) => {
                const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                return `"${stringVal.replace(/"/g, '""')}"`;
            }).join(",");
        });
        
        const csvContent = [headers, ...csvRows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = config.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success(`${type} downloaded successfully!`);
    } catch (error) {
        console.error(error);
        toast.error(`Failed to generate ${type}`);
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage platform users, monitor activity, and generate reports</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active NGOs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeNGOs || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeVolunteers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOpportunities || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row flex-wrap gap-4">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => generateReport("Users Report")}>
            <Users className="mr-2 h-4 w-4" /> Users Report
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => generateReport("Pickups Report")}>
            <Truck className="mr-2 h-4 w-4" /> Pickups Report
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => generateReport("Opportunities Report")}>
            <FileText className="mr-2 h-4 w-4" /> Opportunities Report
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => generateReport("Full Activity Report")}>
            <Activity className="mr-2 h-4 w-4" /> Full Activity Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity (Admin Logs) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
             {stats?.recentActivities?.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent activity.</p>
             ) : (
                stats?.recentActivities?.map((log: any) => (
                    <div key={log._id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div>
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">by {log.adminId?.name || "Unknown Admin"}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))
             )}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
