import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

export default router;
