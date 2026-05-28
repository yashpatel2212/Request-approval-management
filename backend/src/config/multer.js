import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "./env.js";
import { ALLOWED_FILE_TYPES } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";

const uploadRoot = path.resolve(process.cwd(), env.uploadDir, "requests");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return cb(new ApiError(400, "Unsupported file type"));
    }
    cb(null, true);
  }
});
