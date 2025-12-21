
# WasteZero — Frontend (Milestone 1)

## Technologies
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Milestone 1 — What’s implemented
- Project scaffold (Vite + TS + React + Tailwind + shadcn-ui)
- Authentication
  - Login / Register UI (frontend/src/pages/LoginPage.tsx)
  - AuthContext with token storage and user loading (frontend/src/contexts/AuthContext.tsx)
  - API client helpers for auth (frontend/src/lib/api.ts)
  - ProtectedRoute for role-based access control (frontend/src/components/ProtectedRoute.tsx)
- Routing & Layout
  - BrowserRouter routes and dashboard redirect (frontend/src/App.tsx, DashboardRedirect)
  - Dashboard layout with TopBar, Sidebar, BottomNav and responsive behavior (frontend/src/components/layout/)
  - Role-specific dashboard routes for VOLUNTEER and NGO
- Profile management
  - My Profile page with editable ProfileForm and PasswordForm UI (frontend/src/pages/profile/MyProfilePage.tsx and components)
  - API calls wired for getMyProfile, updateMyProfile, changePassword
- Dashboard & UI components (initial versions / stubs)
  - VolunteerDashboard, NgoDashboard pages and components like ApplicationsList, ProfileCard, MetricsStrip, MessagesPreview, UpcomingPickups, RecyclingBreakdown
  - Many dashboard endpoints are stubbed to prevent runtime crashes (frontend/src/lib/api.ts)
- Backend (basic)
  - Express server, user routes and controllers for profile & password change (backend/)
  - Auth middleware with JWT protection
  - .env example contains DB URI, PORT, CLIENT_URL, JWT_SECRET
- UX & tooling
  - Toasts, tooltips, responsive sidebar (mobile sheet), keyboard shortcut for sidebar
  - React Query setup (QueryClient) present


