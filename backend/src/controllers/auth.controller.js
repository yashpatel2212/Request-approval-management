import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { writeAudit } from "../services/audit.service.js";

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  req.user = data.user;
  await writeAudit({ req, action: "LOGIN", entity: "User" });
  res.json(new ApiResponse("Login successful", data));
});

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);
  res.status(201).json(new ApiResponse("User registered", data));
});

export const me = asyncHandler(async (req, res) => {
  res.json(new ApiResponse("Current user", { user: req.user }));
});

export const logout = asyncHandler(async (_req, res) => {
  res.json(new ApiResponse("Logout successful"));
});
