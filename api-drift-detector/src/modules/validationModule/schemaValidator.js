import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({
  allErrors: true,
  strict: false
});

addFormats(ajv);

export function validateResponse(schema, data) {

  const validate = ajv.compile(schema);

  const valid = validate(data);

  return {
    valid,
    errors: validate.errors || []
  };

}