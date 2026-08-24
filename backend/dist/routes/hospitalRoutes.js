"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hospitalController_js_1 = require("../controllers/hospitalController.js");
const router = (0, express_1.Router)();
router.get("/", hospitalController_js_1.hospitalController.getNearbyHospitals);
exports.default = router;
