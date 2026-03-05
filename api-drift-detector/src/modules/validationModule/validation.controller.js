import { validateEndpointResponse } from "./validation.service.js";

export async function validateResponseController(req, res) {
  try {
    const { schema, response } = req.body;

    if (!schema || !response) {
      return res.status(400).json({
        success: false,
        message: "schema and response are required"
      });
    }

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