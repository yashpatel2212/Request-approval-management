import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) throw new ApiError(403, "Account is disabled");

  user.lastLoginAt = new Date();
  await user.save();

  const cleanUser = await User.findById(user._id);
  return { user: cleanUser, token: generateToken(user) };
};

export const registerUser = async (payload) => {
  const exists = await User.exists({ email: payload.email });
  if (exists) throw new ApiError(409, "Email already exists");
  const user = await User.create(payload);
  return { user, token: generateToken(user) };
};
