import { classifyDrift } from "./driftClassifier.js";

export function detectDrift(validationResult) {
  if (validationResult.valid) {
    return {
      drift: false,
      issues: []
    };
  }

  const issues = classifyDrift(validationResult.errors);

  return {
    drift: true,
    issues
  };
}