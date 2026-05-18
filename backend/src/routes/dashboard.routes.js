import { Router } from "express";
import { employeeDashboard, managerDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(protect);
router.get("/employee", authorize(ROLES.EMPLOYEE), employeeDashboard);
router.get("/manager", authorize(ROLES.MANAGER), managerDashboard);

export default router;
