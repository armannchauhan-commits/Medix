"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessmentController_js_1 = require("../controllers/assessmentController.js");
const router = (0, express_1.Router)();
router.post("/", assessmentController_js_1.assessmentController.assessSymptoms);
exports.default = router;
