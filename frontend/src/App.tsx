import Chat from "@/pages/dashboard/Chat";
import Matches from "@/pages/dashboard/Matches";
import Messages from "@/pages/dashboard/Messages";

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
import OpportunitiesPage from "@/pages/dashboard/OpportunitiesPage";
import CreateOpportunity from "@/pages/dashboard/CreateOpportunity";
import EditOpportunity from "@/pages/dashboard/EditOpportunity";
import ProfilePage from "@/pages/dashboard/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
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

            {/* Dashboard redirect */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* ================= VOLUNTEER DASHBOARD ================= */}
            <Route
              path="/dashboard/volunteer"
              element={
                <ProtectedRoute allowedRoles={["VOLUNTEER"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<VolunteerDashboard />} />
              <Route path="opportunities" element={<OpportunitiesPage />} />
              <Route path="applications" element={<VolunteerDashboard />} />

              {/* ✅ Milestone 3 */}
              <Route path="matches" element={<Matches />} />

              {/* ✅ FIXED MESSAGES ROUTING */}
              <Route path="messages" element={<Messages />} />
              <Route path="messages/:matchId" element={<Chat />} />

              <Route path="schedule" element={<VolunteerDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<VolunteerDashboard />} />
            </Route>

           {/* ================= NGO DASHBOARD ================= */}
<Route
  path="/dashboard/ngo"
  element={
    <ProtectedRoute allowedRoles={["NGO"]}>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<NgoDashboard />} />
  <Route path="opportunities" element={<OpportunitiesPage />} />
  <Route path="opportunities/new" element={<CreateOpportunity />} />
  <Route path="opportunities/:id/edit" element={<EditOpportunity />} />
  <Route path="volunteers" element={<NgoDashboard />} />

  {/* ✅ FIXED NGO MESSAGES */}
  <Route path="messages" element={<Messages />} />
  <Route path="messages/:matchId" element={<Chat />} />

  <Route path="schedule" element={<NgoDashboard />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="settings" element={<NgoDashboard />} />
</Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
