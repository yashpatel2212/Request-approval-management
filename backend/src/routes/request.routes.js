import { Router } from "express";
import {
  addAttachments,
  approve,
  deleteAttachment,
  downloadAttachment,
  getById,
  myRequests,
  pdf,
  receivedRequests,
  reject,
  resubmit,
  returnCorrection,
  saveDraft,
  submit,
  updateDraftRequest
} from "../controllers/request.controller.js";
import { upload } from "../config/multer.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { managerActionSchema, requestSchema } from "../validators/request.validator.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(protect);

router.post("/draft", authorize(ROLES.EMPLOYEE), upload.array("attachments", 10), validate(requestSchema), saveDraft);
router.post("/submit", authorize(ROLES.EMPLOYEE), upload.array("attachments", 10), validate(requestSchema), submit);
router.get("/my", authorize(ROLES.EMPLOYEE), myRequests);
router.get("/received", authorize(ROLES.MANAGER), receivedRequests);

router.get("/:id", getById);
router.get("/:id/preview", authorize(ROLES.MANAGER), getById);
router.get("/:id/pdf", pdf);
router.post("/:id/pdf/generate", pdf);

router.put("/:id/draft", authorize(ROLES.EMPLOYEE), upload.array("attachments", 10), validate(requestSchema), updateDraftRequest);
router.put("/:id/resubmit", authorize(ROLES.EMPLOYEE), upload.array("attachments", 10), validate(requestSchema), resubmit);

router.put("/:id/approve", authorize(ROLES.MANAGER), validate(managerActionSchema), approve);
router.put("/:id/reject", authorize(ROLES.MANAGER), validate(managerActionSchema), reject);
router.put("/:id/return-correction", authorize(ROLES.MANAGER), validate(managerActionSchema), returnCorrection);

router.post("/:id/attachments", authorize(ROLES.EMPLOYEE), upload.array("attachments", 10), addAttachments);
router.get("/:id/attachments/:attachmentId/download", downloadAttachment);
router.delete("/:id/attachment/:attachmentId", authorize(ROLES.EMPLOYEE), deleteAttachment);

export default router;
