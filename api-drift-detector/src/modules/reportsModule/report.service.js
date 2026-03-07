import Report from "../../models/report.model.js";

export async function createReport(data) {
  const report = await Report.create({
    projectId: data.projectId,
    endpoint: data.endpoint,
    severity: data.severity,
    issues: data.issues
  });

  return report;
}

export async function fetchReports() {
  const reports = await Report.find().sort({ createdAt: -1 });
  return reports;
}

export async function fetchReportByProject(projectId) {
  const reports = await Report.find({ projectId }).sort({ createdAt: -1 });

  if (!reports.length) {
    throw new Error("No reports found for this project");
  }

  return reports;
}