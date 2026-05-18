import { api } from "./axiosInstance";

export const employeeDashboardApi = () => api.get("/dashboard/employee");
export const managerDashboardApi = () => api.get("/dashboard/manager");
