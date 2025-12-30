import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOpportunityById, updateOpportunity } from "@/lib/api";
import { OpportunityForm } from "@/components/dashboard/OpportunityForm";
import { alertToast } from "@/components/ui/AlertToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Opportunity } from "@/types";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    if (!id) return;
    getOpportunityById(id)
      .then(setOpportunity)
      .catch(() => {
        alertToast.error({ title: "Failed to load opportunity" });
        navigate("/dashboard/ngo/opportunities");
      })
      .finally(() => setIsFetching(false));
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await updateOpportunity(id, data);
      alertToast.success({ title: "Opportunity updated successfully" });
      navigate("/dashboard/ngo/opportunities");
    } catch (error: any) {
      alertToast.error({ title: "Failed to update opportunity", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          {opportunity && (
            <OpportunityForm 
              initialData={opportunity} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
