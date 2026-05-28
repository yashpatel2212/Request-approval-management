import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    metadata: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
