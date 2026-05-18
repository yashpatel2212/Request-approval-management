import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import requestRoutes from "./request.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Royal Group API is healthy" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/requests", requestRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notifications", notificationRoutes);

export default router;
