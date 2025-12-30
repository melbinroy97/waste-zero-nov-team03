import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunitiesList } from "@/components/dashboard/OpportunitiesList";
import { getOpportunities, deleteOpportunity } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { alertToast } from "@/components/ui/AlertToast";
import type { Opportunity } from "@/types";

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const data = await getOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error("Failed to fetch opportunities", error);
      alertToast.error({ title: "Failed to load opportunities" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleCreate = () => {
    navigate("/dashboard/ngo/opportunities/new");
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/ngo/opportunities/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
    
    try {
      await deleteOpportunity(id);
      alertToast.success({ title: "Opportunity deleted" });
      fetchOpportunities(); // Refresh list
    } catch (error) {
      alertToast.error({ title: "Failed to delete" });
    }
  };

  const isNGO = user?.role === "NGO";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground">
            {isNGO ? "Manage your volunteer opportunities" : "Browse available volunteer opportunities"}
          </p>
        </div>
        
        {isNGO && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Opportunity
          </Button>
        )}
      </div>

      <OpportunitiesList 
        opportunities={opportunities} 
        isLoading={isLoading} 
        onCreateNew={isNGO ? handleCreate : undefined}
        onEdit={isNGO ? handleEdit : undefined}
        onDelete={isNGO ? handleDelete : undefined}
      />
    </div>
  );
}
