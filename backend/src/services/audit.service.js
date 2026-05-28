import { AuditLog } from "../models/auditLog.model.js";

export const writeAudit = async ({ req, request, action, entity, metadata = {} }) => {
  await AuditLog.create({
    user: req.user?._id,
    request: request?._id || request,
    action,
    entity,
    metadata,
    ipAddress: req.ip,
    userAgent: typeof req.get === "function" ? req.get("user-agent") : undefined
  });
};
