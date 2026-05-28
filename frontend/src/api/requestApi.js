import { api } from "./axiosInstance";

export const getManagersApi = () => api.get("/users/managers");
export const saveDraftApi = (data) => api.post("/requests/draft", data);
export const submitRequestApi = (data) => api.post("/requests/submit", data);
export const updateDraftApi = (id, data) => api.put(`/requests/${id}/draft`, data);
export const resubmitRequestApi = (id, data) => api.put(`/requests/${id}/resubmit`, data);
export const myRequestsApi = (params) => api.get("/requests/my", { params });
export const receivedRequestsApi = (params) => api.get("/requests/received", { params });
export const requestByIdApi = (id) => api.get(`/requests/${id}`);
export const approveRequestApi = (id, remarks) => api.put(`/requests/${id}/approve`, { remarks });
export const rejectRequestApi = (id, remarks) => api.put(`/requests/${id}/reject`, { remarks });
export const returnCorrectionApi = (id, remarks) => api.put(`/requests/${id}/return-correction`, { remarks });
export const pdfUrl = (id) => `${api.defaults.baseURL}/requests/${id}/pdf`;
export const downloadPdfApi = (id) => api.get(`/requests/${id}/pdf`, { responseType: "blob" });
export const downloadAttachmentApi = (requestId, attachmentId) =>
  api.get(`/requests/${requestId}/attachments/${attachmentId}/download`, { responseType: "blob" });
