import { NotificationLog } from "../models/notificationLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const notificationLogs = asyncHandler(async (_req, res) => {
  const logs = await NotificationLog.find().populate("recipient", "name email").sort({ createdAt: -1 }).limit(100);
  res.json(new ApiResponse("Notification logs loaded", logs));
});

export const requestNotificationLogs = asyncHandler(async (req, res) => {
  const logs = await NotificationLog.find({ request: req.params.requestId }).sort({ createdAt: -1 });
  res.json(new ApiResponse("Request notification logs loaded", logs));
});
