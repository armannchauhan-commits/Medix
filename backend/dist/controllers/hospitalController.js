"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalController = void 0;
const hospitalService_js_1 = require("../services/hospitalService.js");
exports.hospitalController = {
    getNearbyHospitals: async (req, res, next) => {
        try {
            const lat = Number(req.query.lat);
            const lng = Number(req.query.lng);
            if (isNaN(lat) || isNaN(lng)) {
                return res.status(400).json({
                    hospitals: [],
                    source: "unavailable",
                    reason: "Please provide valid 'lat' and 'lng' query parameters.",
                });
            }
            const result = await (0, hospitalService_js_1.findNearbyHospitals)(lat, lng);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
};
