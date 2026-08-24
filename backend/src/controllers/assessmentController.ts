import { Request, Response, NextFunction } from "express";
import { assessRisk, buildFallbackExplanation } from "../services/assessmentService.js";

export const assessmentController = {
  assessSymptoms: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symptomText, structured, profileContext } = req.body;

      if (!symptomText || typeof symptomText !== "string" || !symptomText.trim()) {
        return res.status(400).json({
          error: "Please describe your symptoms before requesting an assessment.",
        });
      }

      // Step 1: Authoritative deterministic risk assessment
      const risk = assessRisk(symptomText.trim(), structured);

      // Step 2: Content explanation
      const content = buildFallbackExplanation(risk.riskLevel, symptomText.trim());

      res.json({
        risk,
        content,
        source: "engine",
        evaluatedAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  },
};
