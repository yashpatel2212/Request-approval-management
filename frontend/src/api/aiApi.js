import { api } from "./axiosInstance";

export const generateRequestDraftApi = (payload) => api.post("/ai/request-draft", payload);
