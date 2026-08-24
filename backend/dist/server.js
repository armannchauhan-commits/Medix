"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_js_1 = require("./config/index.js");
const cors_js_1 = require("./middleware/cors.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const index_js_2 = __importDefault(require("./routes/index.js"));
const app = (0, express_1.default)();
// Global middleware
app.use(cors_js_1.corsMiddleware);
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
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
        frontend: index_js_1.config.appUrl,
    });
});
// Mount all API routes under /api
app.use("/api", index_js_2.default);
// Global 404 handler for unhandled API routes
app.use("/api/*", (req, res) => {
    res.status(404).json({
        success: false,
        error: `API endpoint ${req.method} ${req.originalUrl} not found.`,
    });
});
// Global error handler
app.use(errorHandler_js_1.errorHandler);
// Start server
const server = app.listen(index_js_1.config.port, () => {
    console.log(`\n==================================================`);
    console.log(`🚨 Medix Backend Server running on port ${index_js_1.config.port}`);
    console.log(`🌐 Health check: http://localhost:${index_js_1.config.port}/api/health`);
    console.log(`📱 SMS Service: ${index_js_1.config.twilio.isConfigured ? "LIVE (Twilio)" : "DEMO (Unconfigured)"}`);
    console.log(`🔗 Allowed Origin: ${index_js_1.config.corsOrigin}`);
    console.log(`==================================================\n`);
});
exports.default = server;
