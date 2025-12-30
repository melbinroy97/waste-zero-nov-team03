import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOpportunity } from "@/lib/api";
import { OpportunityForm } from "@/components/dashboard/OpportunityForm";
import { alertToast } from "@/components/ui/AlertToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createOpportunity(data);
      alertToast.success({ title: "Opportunity created successfully" });
      navigate("/dashboard/ngo/opportunities");
    } catch (error: any) {
      alertToast.error({ title: "Failed to create opportunity", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <OpportunityForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
