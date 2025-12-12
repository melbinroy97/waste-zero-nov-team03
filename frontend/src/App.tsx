import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import DashboardRedirect from "./pages/dashboard/DashboardRedirect";
import VolunteerDashboard from "./pages/dashboard/VolunteerDashboard";
import NgoDashboard from "./pages/dashboard/NgoDashboard";

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

            {/* Protected dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/volunteer"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<VolunteerDashboard />} />
              <Route path="opportunities" element={<VolunteerDashboard />} />
              <Route path="applications" element={<VolunteerDashboard />} />
              <Route path="messages" element={<VolunteerDashboard />} />
              <Route path="schedule" element={<VolunteerDashboard />} />
              <Route path="settings" element={<VolunteerDashboard />} />
            </Route>

            <Route
              path="/dashboard/ngo"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<NgoDashboard />} />
              <Route path="opportunities" element={<NgoDashboard />} />
              <Route path="volunteers" element={<NgoDashboard />} />
              <Route path="messages" element={<NgoDashboard />} />
              <Route path="schedule" element={<NgoDashboard />} />
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
