import { Router } from "express";
import { getEmployees, getManagers } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/managers", getManagers);
router.get("/employees", getEmployees);

export default router;
