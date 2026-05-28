import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../utils/constants.js";

export const getManagers = asyncHandler(async (_req, res) => {
  const managers = await User.find({ role: ROLES.MANAGER, isActive: true }).sort({ name: 1 });
  res.json(new ApiResponse("Managers loaded", managers));
});

export const getEmployees = asyncHandler(async (_req, res) => {
  const employees = await User.find({ role: ROLES.EMPLOYEE, isActive: true }).sort({ name: 1 });
  res.json(new ApiResponse("Employees loaded", employees));
});
