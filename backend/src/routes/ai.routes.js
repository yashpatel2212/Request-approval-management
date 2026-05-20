import { Router } from "express";
import { draftAssistant } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { draftAssistantSchema } from "../validators/ai.validator.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(protect, authorize(ROLES.EMPLOYEE));
router.post("/request-draft", validate(draftAssistantSchema), draftAssistant);

export default router;
