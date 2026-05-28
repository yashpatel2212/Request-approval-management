import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => async (req, _res, next) => {
  try {
    req.body = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    next();
  } catch (error) {
    next(new ApiError(400, "Validation failed", error.errors));
  }
};
