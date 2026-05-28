import fs from "fs";
import path from "path";
import { Request } from "../models/request.model.js";
import { RequestComment } from "../models/requestComment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { COMMENT_ACTION, EMAIL_TYPES, REQUEST_STATUS, ROLES } from "../utils/constants.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
import { sendRequestEmail } from "./email.service.js";
import { createRequestPdfBuffer } from "./pdf.service.js";

const populateRequest = (query) =>
  query.populate("transactionCreator sender receiver", "name email role department designation");

const toAttachmentDocs = (files = []) =>
  files.map((file) => ({
    originalName: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    size: file.size
  }));

const assertEmployeeOwnsDraft = (request, user) => {
  if (!request) throw new ApiError(404, "Request not found");
  if (!request.transactionCreator.equals(user._id)) throw new ApiError(403, "Request does not belong to you");
  if (request.status !== REQUEST_STATUS.DRAFT) throw new ApiError(400, "Only draft requests can be edited");
};

export const createDraft = async ({ user, body, files }) => {
  const request = await Request.create({
    ...body,
    notes: sanitizeRichText(body.notes),
    transactionCreator: user._id,
    sender: body.sender || user._id,
    attachments: toAttachmentDocs(files),
    status: REQUEST_STATUS.DRAFT
  });

  await RequestComment.create({
    request: request._id,
    user: user._id,
    action: COMMENT_ACTION.CREATED,
    comment: "Draft created"
  });

  return populateRequest(Request.findById(request._id));
};

export const submitRequest = async ({ user, body, files }) => {
  const receiver = await User.findOne({ _id: body.receiver, role: ROLES.MANAGER, isActive: true });
  if (!receiver) throw new ApiError(400, "Receiver must be an active manager");

  const request = await Request.create({
    ...body,
    notes: sanitizeRichText(body.notes),
    transactionCreator: user._id,
    sender: body.sender || user._id,
    attachments: toAttachmentDocs(files),
    status: REQUEST_STATUS.PENDING,
    submittedAt: new Date()
  });

  const populated = await populateRequest(Request.findById(request._id));

  await RequestComment.create({
    request: request._id,
    user: user._id,
    action: COMMENT_ACTION.SUBMITTED,
    comment: "Request submitted"
  });

  await sendRequestEmail({
    type: EMAIL_TYPES.REQUEST_SUBMITTED,
    request: populated,
    recipients: [populated.sender, populated.receiver]
  });

  return populated;
};

export const updateDraft = async ({ user, requestId, body, files }) => {
  const request = await Request.findById(requestId);
  assertEmployeeOwnsDraft(request, user);

  Object.assign(request, {
    ...body,
    notes: body.notes ? sanitizeRichText(body.notes) : request.notes
  });
  request.attachments.push(...toAttachmentDocs(files));
  await request.save();

  await RequestComment.create({
    request: request._id,
    user: user._id,
    action: COMMENT_ACTION.UPDATED,
    comment: "Draft updated"
  });

  return populateRequest(Request.findById(request._id));
};

export const resubmitRequest = async ({ user, requestId, body, files }) => {
  const request = await Request.findById(requestId);
  assertEmployeeOwnsDraft(request, user);

  Object.assign(request, {
    ...body,
    notes: body.notes ? sanitizeRichText(body.notes) : request.notes,
    status: REQUEST_STATUS.PENDING,
    correctionNotes: undefined,
    submittedAt: new Date()
  });
  request.attachments.push(...toAttachmentDocs(files));
  await request.save();

  const populated = await populateRequest(Request.findById(request._id));
  await RequestComment.create({
    request: request._id,
    user: user._id,
    action: COMMENT_ACTION.RESUBMITTED,
    comment: "Corrected request resubmitted"
  });

  await sendRequestEmail({
    type: EMAIL_TYPES.REQUEST_SUBMITTED,
    request: populated,
    recipients: [populated.sender, populated.receiver]
  });

  return populated;
};

export const managerAction = async ({ user, requestId, action, remarks }) => {
  const request = await Request.findOne({ _id: requestId, receiver: user._id });
  if (!request) throw new ApiError(404, "Request not found");
  if (request.status !== REQUEST_STATUS.PENDING) throw new ApiError(400, "Only pending requests can be actioned");

  const now = new Date();
  const actionMap = {
    approve: {
      status: REQUEST_STATUS.APPROVED,
      action: COMMENT_ACTION.APPROVED,
      email: EMAIL_TYPES.REQUEST_APPROVED,
      dateField: "approvedAt"
    },
    reject: {
      status: REQUEST_STATUS.REJECTED,
      action: COMMENT_ACTION.REJECTED,
      email: EMAIL_TYPES.REQUEST_REJECTED,
      dateField: "rejectedAt"
    },
    correction: {
      status: REQUEST_STATUS.DRAFT,
      action: COMMENT_ACTION.RETURNED,
      email: EMAIL_TYPES.REQUEST_CORRECTION,
      dateField: "returnedAt"
    }
  };

  const config = actionMap[action];
  if (!config) throw new ApiError(400, "Invalid manager action");

  request.status = config.status;
  request[config.dateField] = now;
  if (action === "correction") request.correctionNotes = remarks;
  else request.managerRemarks = remarks;
  await request.save();

  const populated = await populateRequest(Request.findById(request._id));

  await RequestComment.create({
    request: request._id,
    user: user._id,
    action: config.action,
    comment: remarks
  });

  const pdfBuffer = action === "correction" ? null : await createRequestPdfBuffer(populated);

  await sendRequestEmail({
    type: config.email,
    request: populated,
    recipients: [populated.sender, populated.transactionCreator],
    comment: remarks,
    attachments:
      action === "correction"
        ? []
        : [
            {
              filename: `${populated.requestNumber}.pdf`,
              content: pdfBuffer
            },
            ...populated.attachments.map((file) => ({
              filename: file.originalName,
              path: path.resolve(file.filePath)
            }))
          ]
  });

  return populated;
};

export const listMyRequests = ({ user, query }) => {
  const filter = { transactionCreator: user._id };
  if (query.status) filter.status = query.status;
  if (query.search) filter.noteSubject = { $regex: query.search, $options: "i" };
  return populateRequest(Request.find(filter).sort({ createdAt: -1 }));
};

export const listReceivedRequests = ({ user, query }) => {
  const filter = { receiver: user._id };
  if (query.status) filter.status = query.status;
  if (query.search) filter.noteSubject = { $regex: query.search, $options: "i" };
  return populateRequest(Request.find(filter).sort({ createdAt: -1 }));
};

export const getRequestForUser = async ({ user, requestId }) => {
  const request = await populateRequest(Request.findById(requestId));
  if (!request) throw new ApiError(404, "Request not found");

  const canView =
    request.transactionCreator._id.equals(user._id) ||
    request.sender._id.equals(user._id) ||
    request.receiver._id.equals(user._id);

  if (!canView) throw new ApiError(403, "You cannot view this request");
  const comments = await RequestComment.find({ request: request._id }).populate("user", "name role").sort({ createdAt: 1 });
  return { request, comments };
};

export const removeAttachment = async ({ user, requestId, attachmentId }) => {
  const request = await Request.findById(requestId);
  assertEmployeeOwnsDraft(request, user);
  const attachment = request.attachments.id(attachmentId);
  if (!attachment) throw new ApiError(404, "Attachment not found");

  if (fs.existsSync(attachment.filePath)) fs.unlinkSync(attachment.filePath);
  attachment.deleteOne();
  await request.save();
  return request;
};
