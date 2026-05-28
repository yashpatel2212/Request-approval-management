import mongoose from "mongoose";
import { EMAIL_TYPES } from "../utils/constants.js";

const notificationLogSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: String,
    type: { type: String, enum: Object.values(EMAIL_TYPES), required: true },
    subject: String,
    status: { type: String, enum: ["Sent", "Failed"], required: true },
    errorMessage: String,
    sentAt: Date
  },
  { timestamps: true }
);

export const NotificationLog = mongoose.model("NotificationLog", notificationLogSchema);
