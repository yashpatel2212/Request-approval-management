import { api } from "./axiosInstance";

export const loginApi = (payload) => api.post("/auth/login", payload);
export const meApi = () => api.get("/auth/me");
