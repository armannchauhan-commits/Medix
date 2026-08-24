"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactRoutes_js_1 = __importDefault(require("./contactRoutes.js"));
const emergencyRoutes_js_1 = __importDefault(require("./emergencyRoutes.js"));
const hospitalRoutes_js_1 = __importDefault(require("./hospitalRoutes.js"));
const assessmentRoutes_js_1 = __importDefault(require("./assessmentRoutes.js"));
const apiRouter = (0, express_1.Router)();
// Health check endpoint
apiRouter.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "medix-backend",
        version: "0.1.0",
        timestamp: new Date().toISOString(),
    });
});
apiRouter.use("/contacts", contactRoutes_js_1.default);
apiRouter.use("/emergency", emergencyRoutes_js_1.default);
apiRouter.use("/hospitals", hospitalRoutes_js_1.default);
apiRouter.use("/symptom-assessment", assessmentRoutes_js_1.default);
exports.default = apiRouter;
