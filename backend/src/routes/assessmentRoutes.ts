import { Router } from "express";
import { assessmentController } from "../controllers/assessmentController.js";

const router = Router();

router.post("/", assessmentController.assessSymptoms);

export default router;
