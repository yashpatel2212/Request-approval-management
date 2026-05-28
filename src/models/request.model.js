import mongoose from "mongoose";
import { REQUEST_STATUS } from "../utils/constants.js";

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    filePath: String,
    mimeType: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const requestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, unique: true, index: true },
    approvalType: { type: String, enum: ["Indirect", "Direct"], required: true },
    transactionCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    priority: { type: String, enum: ["Low", "High"], default: "Low" },
    confidentiality: { type: String, enum: ["Normal", "Confidential"], default: "Normal" },
    bookLanguage: { type: String, enum: ["English"], default: "English" },
    transactionDate: { type: Date, default: Date.now },
    transactionType: { type: String, enum: ["Inner Book", "Outer Book"], required: true },
    noteSubject: { type: String, required: true, trim: true },
    notes: { type: String, required: true },
    attachments: [attachmentSchema],
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.DRAFT,
      index: true
    },
    correctionNotes: String,
    managerRemarks: String,
    submittedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    returnedAt: Date
  },
  { timestamps: true }
);

requestSchema.pre("save", async function assignRequestNumber(next) {
  if (this.requestNumber) return next();
  const count = await mongoose.model("Request").countDocuments();
  this.requestNumber = `RG-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;
  next();
});

export const Request = mongoose.model("Request", requestSchema);
