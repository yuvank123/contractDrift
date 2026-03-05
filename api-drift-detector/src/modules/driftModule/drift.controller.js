import { detectDrift } from "./drift.service.js";

export function driftController(req, res) {
  try {
    const { validationResult } = req.body;

    const result = detectDrift(validationResult);

    res.json({
      success: true,
      result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}