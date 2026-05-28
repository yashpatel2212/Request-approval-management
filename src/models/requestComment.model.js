import mongoose from "mongoose";
import { COMMENT_ACTION } from "../utils/constants.js";

const requestCommentSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: Object.values(COMMENT_ACTION), required: true },
    comment: { type: String, trim: true }
  },
  { timestamps: true }
);

export const RequestComment = mongoose.model("RequestComment", requestCommentSchema);
