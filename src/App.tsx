import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AttendanceCheckIn from "./pages/AttendanceCheckIn";
import LeaveRequest from "./pages/LeaveRequest";
import MyAttendance from "./pages/MyAttendance";
import MyLeaveRequests from "./pages/MyLeaveRequests";
import AdminAttendance from "./pages/AdminAttendance";
import AdminLeaveRequests from "./pages/AdminLeaveRequests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AttendanceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute allowedRoles={['employee']}>
                    <AttendanceCheckIn />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leave-request" 
                element={
                  <ProtectedRoute allowedRoles={['employee']}>
                    <LeaveRequest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-attendance" 
                element={
                  <ProtectedRoute allowedRoles={['employee']}>
                    <MyAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-leave-requests" 
                element={
                  <ProtectedRoute allowedRoles={['employee']}>
                    <MyLeaveRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/attendance" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/leave-requests" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLeaveRequests />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AttendanceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
