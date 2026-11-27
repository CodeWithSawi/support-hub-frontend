import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";

import Dashboard from "@/pages/dashboard/DashboardPage";

import TicketsPage from "@/pages/tickets/TicketsPage";
import TicketDetailsPage from "@/pages/tickets/TicketDetails";

import UsersPage from "@/pages/users/Users";
import NotFound from "@/pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tickets" element={<TicketsPage />} />

            <Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
          </Route>
        </Route>

        {/* Administrator-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
