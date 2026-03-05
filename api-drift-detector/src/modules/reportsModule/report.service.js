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

export async function fetchReport(id) {
  const report = await Report.findById(id);

  if (!report) {
    throw new Error("Report not found");
  }

  return report;
}