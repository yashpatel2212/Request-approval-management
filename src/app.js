import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app = express();
const allowedOrigins = new Set([env.clientUrl, "http://localhost:5173", "http://127.0.0.1:5173"]);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
app.use("/uploads", express.static(path.resolve(process.cwd(), env.uploadDir)));

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
