import { runCheck } from "./check.service.js";

export async function runCheckController(req, res) {

  try {

    const { filePath, baseUrl, projectId } = req.body;

    if (!filePath || !baseUrl) {
      return res.status(400).json({
        success: false,
        message: "filePath and baseUrl are required"
      });
    }

    const result = await runCheck({
      filePath,
      baseUrl,
      projectId
    });

    res.json({
      success: true,
      checkRun: result.checkRun,
      reports: result.reports
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

}