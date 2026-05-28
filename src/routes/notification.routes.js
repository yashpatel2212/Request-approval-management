import { Router } from "express";
import { notificationLogs, requestNotificationLogs } from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(protect, authorize(ROLES.MANAGER));
router.get("/logs", notificationLogs);
router.get("/request/:requestId", requestNotificationLogs);

export default router;
