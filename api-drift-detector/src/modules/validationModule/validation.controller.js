import { validateEndpointResponse } from "./validation.service.js";

export async function validateResponseController(req, res) {
  try {
    const { schema, response } = req.body;

    const result = validateEndpointResponse(schema, response);

    res.status(200).json({
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