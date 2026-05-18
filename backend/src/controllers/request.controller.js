import path from "path";
import { Request } from "../models/request.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { writeAudit } from "../services/audit.service.js";
import { streamRequestPdf } from "../services/pdf.service.js";
import {
  createDraft,
  getRequestForUser,
  listMyRequests,
  listReceivedRequests,
  managerAction,
  removeAttachment,
  resubmitRequest,
  submitRequest,
  updateDraft
} from "../services/request.service.js";

export const saveDraft = asyncHandler(async (req, res) => {
  const request = await createDraft({ user: req.user, body: req.body, files: req.files });
  await writeAudit({ req, request, action: "CREATE_DRAFT", entity: "Request" });
  res.status(201).json(new ApiResponse("Draft saved", request));
});

export const submit = asyncHandler(async (req, res) => {
  const request = await submitRequest({ user: req.user, body: req.body, files: req.files });
  await writeAudit({ req, request, action: "SUBMIT_REQUEST", entity: "Request" });
  res.status(201).json(new ApiResponse("Request submitted", request));
});

export const updateDraftRequest = asyncHandler(async (req, res) => {
  const request = await updateDraft({ user: req.user, requestId: req.params.id, body: req.body, files: req.files });
  await writeAudit({ req, request, action: "UPDATE_DRAFT", entity: "Request" });
  res.json(new ApiResponse("Draft updated", request));
});

export const resubmit = asyncHandler(async (req, res) => {
  const request = await resubmitRequest({ user: req.user, requestId: req.params.id, body: req.body, files: req.files });
  await writeAudit({ req, request, action: "RESUBMIT_REQUEST", entity: "Request" });
  res.json(new ApiResponse("Request resubmitted", request));
});

export const approve = asyncHandler(async (req, res) => {
  const request = await managerAction({ user: req.user, requestId: req.params.id, action: "approve", remarks: req.body.remarks });
  await writeAudit({ req, request, action: "APPROVE_REQUEST", entity: "Request" });
  res.json(new ApiResponse("Request approved", request));
});

export const reject = asyncHandler(async (req, res) => {
  const request = await managerAction({ user: req.user, requestId: req.params.id, action: "reject", remarks: req.body.remarks });
  await writeAudit({ req, request, action: "REJECT_REQUEST", entity: "Request" });
  res.json(new ApiResponse("Request rejected", request));
});

export const returnCorrection = asyncHandler(async (req, res) => {
  const request = await managerAction({ user: req.user, requestId: req.params.id, action: "correction", remarks: req.body.remarks });
  await writeAudit({ req, request, action: "RETURN_CORRECTION", entity: "Request" });
  res.json(new ApiResponse("Request returned for correction", request));
});

export const myRequests = asyncHandler(async (req, res) => {
  const requests = await listMyRequests({ user: req.user, query: req.query });
  res.json(new ApiResponse("Requests loaded", requests));
});

export const receivedRequests = asyncHandler(async (req, res) => {
  const requests = await listReceivedRequests({ user: req.user, query: req.query });
  res.json(new ApiResponse("Received requests loaded", requests));
});

export const getById = asyncHandler(async (req, res) => {
  const data = await getRequestForUser({ user: req.user, requestId: req.params.id });
  res.json(new ApiResponse("Request loaded", data));
});

export const deleteAttachment = asyncHandler(async (req, res) => {
  const request = await removeAttachment({ user: req.user, requestId: req.params.id, attachmentId: req.params.attachmentId });
  res.json(new ApiResponse("Attachment removed", request));
});

export const downloadAttachment = asyncHandler(async (req, res) => {
  const { request } = await getRequestForUser({ user: req.user, requestId: req.params.id });
  const attachment = request.attachments.id(req.params.attachmentId);
  if (!attachment) throw new ApiError(404, "Attachment not found");
  res.download(path.resolve(attachment.filePath), attachment.originalName);
});

export const pdf = asyncHandler(async (req, res) => {
  const { request } = await getRequestForUser({ user: req.user, requestId: req.params.id });
  streamRequestPdf(request, res);
});

export const addAttachments = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) throw new ApiError(404, "Request not found");
  if (!request.transactionCreator.equals(req.user._id)) throw new ApiError(403, "Request does not belong to you");
  request.attachments.push(
    ...req.files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size
    }))
  );
  await request.save();
  res.json(new ApiResponse("Attachments added", request));
});
