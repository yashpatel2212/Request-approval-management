import { Request } from "../models/request.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { REQUEST_STATUS } from "../utils/constants.js";

const buildStats = async (filter) => {
  const [total, pending, approved, rejected, draft, returnedRecent] = await Promise.all([
    Request.countDocuments(filter),
    Request.countDocuments({ ...filter, status: REQUEST_STATUS.PENDING }),
    Request.countDocuments({ ...filter, status: REQUEST_STATUS.APPROVED }),
    Request.countDocuments({ ...filter, status: REQUEST_STATUS.REJECTED }),
    Request.countDocuments({ ...filter, status: REQUEST_STATUS.DRAFT }),
    Request.countDocuments({ ...filter, correctionNotes: { $exists: true, $ne: "" }, status: REQUEST_STATUS.DRAFT })
  ]);

  return { total, pending, approved, rejected, draft, returned: returnedRecent };
};

export const employeeDashboard = asyncHandler(async (req, res) => {
  const filter = { transactionCreator: req.user._id };
  const [stats, recent] = await Promise.all([
    buildStats(filter),
    Request.find(filter).populate("receiver", "name designation").sort({ createdAt: -1 }).limit(5)
  ]);
  res.json(new ApiResponse("Employee dashboard loaded", { stats, recent }));
});

export const managerDashboard = asyncHandler(async (req, res) => {
  const filter = { receiver: req.user._id };
  const [stats, recent] = await Promise.all([
    buildStats(filter),
    Request.find(filter).populate("transactionCreator sender", "name department").sort({ createdAt: -1 }).limit(8)
  ]);
  res.json(new ApiResponse("Manager dashboard loaded", { stats, recent }));
});
