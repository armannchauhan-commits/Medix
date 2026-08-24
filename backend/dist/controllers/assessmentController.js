"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentController = void 0;
const assessmentService_js_1 = require("../services/assessmentService.js");
exports.assessmentController = {
    assessSymptoms: async (req, res, next) => {
        try {
            const { symptomText, structured, profileContext } = req.body;
            if (!symptomText || typeof symptomText !== "string" || !symptomText.trim()) {
                return res.status(400).json({
                    error: "Please describe your symptoms before requesting an assessment.",
                });
            }
            // Step 1: Authoritative deterministic risk assessment
            const risk = (0, assessmentService_js_1.assessRisk)(symptomText.trim(), structured);
            // Step 2: Content explanation
            const content = (0, assessmentService_js_1.buildFallbackExplanation)(risk.riskLevel, symptomText.trim());
            res.json({
                risk,
                content,
                source: "engine",
                evaluatedAt: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    },
};
