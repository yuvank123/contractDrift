import { detectDrift } from "./drift.service.js";

export async function driftController(req, res) {

  try {

    const { validationResult, reportId } = req.body;

    if (!validationResult) {
      return res.status(400).json({
        success: false,
        message: "validationResult is required"
      });
    }

    const result = await detectDrift(validationResult, reportId);

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