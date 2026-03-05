import { runEndpoints } from "./runner.service.js";

export async function runEndpointsController(req, res) {
  try {
    const { baseUrl, endpoints } = req.body;

    const results = await runEndpoints(baseUrl, endpoints);

    res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}