import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:2000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    // API needed: DELETE /api/admin/users/:id
    // Assuming backend has this. If not, we might need to add it.
    // Based on adminRoutes, let's assume it exists or fail gracefully.
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`http://localhost:2000/api/admin/users/${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
            toast.success("User deleted successfully");
            setUsers(users.filter(u => u._id !== userId));
        } else {
            toast.error("Failed to delete user");
        }
    } catch (err) {
        toast.error("Error deleting user");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
            <p className="text-muted-foreground">View and manage all registered users</p>
        </div>
        <div className="w-[300px]">
            <Input 
                placeholder="Search users..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">Loading...</TableCell>
                </TableRow>
            ) : filteredUsers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No users found.</TableCell>
                </TableRow>
            ) : (
                filteredUsers.map((user) => (
                <TableRow key={user._id}>
                    <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name?.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={user.status === 'BANNED' ? "destructive" : "default"} className={user.status === 'ACTIVE' ? "bg-green-500 hover:bg-green-600" : ""}>
                            {user.status || 'ACTIVE'}
                        </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(user._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
