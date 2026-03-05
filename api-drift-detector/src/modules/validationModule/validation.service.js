import { validateResponse } from "./schemaValidator.js";

export function validateEndpointResponse(schema, response) {

  const result = validateResponse(schema, response);

  return {
    valid: result.valid,
    errors: result.errors
  };

}