import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { EmployeeDashboard } from "../pages/employee/EmployeeDashboard";
import { CreateRequest } from "../pages/employee/CreateRequest";
import { MyRequests } from "../pages/employee/MyRequests";
import { EditRequest } from "../pages/employee/EditRequest";
import { ManagerDashboard } from "../pages/manager/ManagerDashboard";
import { RequestPreview } from "../pages/manager/RequestPreview";
import { NotFound } from "../pages/NotFound";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route element={<RoleRoute role="employee" />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/requests/new" element={<CreateRequest />} />
          <Route path="/employee/requests" element={<MyRequests />} />
          <Route path="/employee/requests/:id" element={<EditRequest />} />
        </Route>
        <Route element={<RoleRoute role="manager" />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/requests/:id" element={<RequestPreview />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);
