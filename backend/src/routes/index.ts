import { Router } from "express";
import contactRoutes from "./contactRoutes.js";
import emergencyRoutes from "./emergencyRoutes.js";
import hospitalRoutes from "./hospitalRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";

const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "medix-backend",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/contacts", contactRoutes);
apiRouter.use("/emergency", emergencyRoutes);
apiRouter.use("/hospitals", hospitalRoutes);
apiRouter.use("/symptom-assessment", assessmentRoutes);

export default apiRouter;
