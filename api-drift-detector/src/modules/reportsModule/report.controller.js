import {
  createReport,
  fetchReports,
  fetchReportByProject
} from "./report.service.js";

export async function createReportController(req, res) {
  try {
    const report = await createReport(req.body);

    res.status(201).json({
      success: true,
      report
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getReportsController(req, res) {
  try {
    const reports = await fetchReports();

    res.json({
      success: true,
      reports
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getReportController(req, res) {
  try {
    const reports = await fetchReportByProject(req.params.id);

    res.json({
      success: true,
      reports
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}