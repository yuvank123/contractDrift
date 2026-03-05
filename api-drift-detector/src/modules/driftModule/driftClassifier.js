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

    else if (err.keyword === "type") {

      issues.push({
        type: "TYPE_MISMATCH",
        field: err.instancePath,
        severity: "HIGH",
        message: `Type mismatch at ${err.instancePath}`
      });

    }

    else if (err.keyword === "additionalProperties") {

      issues.push({
        type: "UNEXPECTED_FIELD",
        field: err.params.additionalProperty,
        severity: "MEDIUM",
        message: `Unexpected field: ${err.params.additionalProperty}`
      });

    }

  }

  return issues;

}