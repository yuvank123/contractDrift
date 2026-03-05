import { parseContractService } from "./contract.service.js";

export async function parseContractController(req, res) {
  try {

    const { filePath, projectId } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "filePath is required"
      });
    }

    const result = await parseContractService({
      filePath,
      projectId
    });

    res.status(200).json({
      success: true,
      message: "Contract parsed successfully",
      contract: result.contract,
      endpoints: result.endpoints
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
}