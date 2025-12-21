import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

import DashboardRedirect from "@/pages/dashboard/DashboardRedirect";
import VolunteerDashboard from "@/pages/dashboard/VolunteerDashboard";
import NgoDashboard from "@/pages/dashboard/NgoDashboard";
import MyProfilePage from "@/pages/profile/MyProfilePage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Redirect after login */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />

              {/* VOLUNTEER DASHBOARD */}
              <Route
                path="/dashboard/volunteer"
                element={
                  <ProtectedRoute allowedRoles={["VOLUNTEER"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<VolunteerDashboard />} />
                <Route path="opportunities" element={<VolunteerDashboard />} />
                <Route path="applications" element={<VolunteerDashboard />} />
                <Route path="messages" element={<VolunteerDashboard />} />
                <Route path="schedule" element={<VolunteerDashboard />} />
              </Route>

              {/* NGO DASHBOARD */}
              <Route
                path="/dashboard/ngo"
                element={
                  <ProtectedRoute allowedRoles={["NGO"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<NgoDashboard />} />
                <Route path="opportunities" element={<NgoDashboard />} />
                <Route path="volunteers" element={<NgoDashboard />} />
                <Route path="messages" element={<NgoDashboard />} />
                <Route path="schedule" element={<NgoDashboard />} />
              </Route>

              {/* MY PROFILE (shared for all roles) */}
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<MyProfilePage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
