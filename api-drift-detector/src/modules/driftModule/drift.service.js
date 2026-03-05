import DriftIssue from "../../models/driftIssue.model.js";
import { classifyDrift } from "./driftClassifier.js";

export async function detectDrift(validationResult, reportId) {

  if (validationResult.valid) {
    return {
      drift: false,
      issues: []
    };
  }

  const issues = classifyDrift(validationResult.errors);

  // save issues to database
  const savedIssues = await DriftIssue.insertMany(
    issues.map(issue => ({
      reportId,
      ...issue
    }))
  );

  return {
    drift: true,
    issues: savedIssues
  };

}