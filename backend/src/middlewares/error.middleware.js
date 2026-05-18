import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || []
  };

  if (env.nodeEnv === "development") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
