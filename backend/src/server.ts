import express from "express";
import { config } from "./config/index.js";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRouter from "./routes/index.js";

const app = express();

// Global middleware
app.use(corsMiddleware);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root welcome & API info
app.get("/", (req, res) => {
  res.json({
    name: "Medix API Server",
    version: "0.1.0",
    docs: "/api/health",
    frontend: config.appUrl,
  });
});

// Mount all API routes under /api
app.use("/api", apiRouter);

// Global 404 handler for unhandled API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log(`\n==================================================`);
  console.log(`🚨 Medix Backend Server running on port ${config.port}`);
  console.log(`🌐 Health check: http://localhost:${config.port}/api/health`);
  console.log(`📱 SMS Service: ${config.twilio.isConfigured ? "LIVE (Twilio)" : "DEMO (Unconfigured)"}`);
  console.log(`🔗 Allowed Origin: ${config.corsOrigin}`);
  console.log(`==================================================\n`);
});

export default server;
