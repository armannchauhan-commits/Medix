import { Request, Response, NextFunction } from "express";
import { findNearbyHospitals } from "../services/hospitalService.js";

export const hospitalController = {
  getNearbyHospitals: async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await findNearbyHospitals(lat, lng);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
