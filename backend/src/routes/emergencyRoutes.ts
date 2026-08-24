import { Router } from "express";
import { emergencyController } from "../controllers/emergencyController.js";

const router = Router();

router.post("/sos", emergencyController.triggerSOS);
router.get("/card/:id", emergencyController.getEmergencyCard);
router.get("/logs", emergencyController.getEmergencyLogs);
router.get("/status", emergencyController.getStatus);

export default router;
