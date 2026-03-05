import { parseContractService } from "./contract.service.js";

export async function parseContractController(req, res) {
  try {
    const { filePath } = req.body;

    const endpoints = await parseContractService(filePath);

    res.status(200).json({
      success: true,
      message: "Contract parsed successfully",
      endpoints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}