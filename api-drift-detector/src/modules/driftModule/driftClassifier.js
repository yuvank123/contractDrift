export function classifyDrift(errors) {
  const issues = [];

  for (const err of errors) {
    if (err.keyword === "required") {
      issues.push({
        type: "MISSING_FIELD",
        field: err.params.missingProperty,
        severity: "HIGH",
        message: `Missing required field: ${err.params.missingProperty}`
      });
    }

    if (err.keyword === "type") {
      issues.push({
        type: "TYPE_MISMATCH",
        field: err.instancePath,
        severity: "HIGH",
        message: `Type mismatch at ${err.instancePath}`
      });
    }
  }

  return issues;
}