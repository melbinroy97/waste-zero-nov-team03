import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "NGO") {
    return <Navigate to="/dashboard/ngo" replace />;
  }

  if (user.role === "VOLUNTEER") {
    return <Navigate to="/dashboard/volunteer" replace />;
  }

  return <Navigate to="/login" replace />;
}
