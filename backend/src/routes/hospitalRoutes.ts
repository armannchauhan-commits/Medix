import { Router } from "express";
import { hospitalController } from "../controllers/hospitalController.js";

const router = Router();

router.get("/", hospitalController.getNearbyHospitals);

export default router;
