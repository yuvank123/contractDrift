import SwaggerParser from "@apidevtools/swagger-parser";
import fs from "fs/promises";

export async function parseContract(filePath) {

  let apiSpec;

  if (filePath.startsWith("http")) {
    const response = await fetch(filePath);
    apiSpec = await response.json();
  } else {
    const file = await fs.readFile(filePath, "utf-8");
    apiSpec = JSON.parse(file);
  }

  if (apiSpec.openapi && apiSpec.openapi.startsWith("3.0.")) {
    apiSpec.openapi = "3.0.3";
  }

  const api = await SwaggerParser.dereference(apiSpec);

  const endpoints = [];

  for (const path in api.paths) {
    const methods = api.paths[path];

    for (const method in methods) {
      const endpoint = methods[method];

      const parameters = endpoint.parameters || [];

      const requestSchema =
        endpoint?.requestBody?.content?.["application/json"]?.schema || null;

      const responses = {};

      for (const status in endpoint.responses) {
        const res = endpoint.responses[status];

        const schema =
          res?.content?.["application/json"]?.schema ||
          res?.content?.["application/*+json"]?.schema ||
          null;

        responses[status] = { schema };
      }

      endpoints.push({
        method: method.toUpperCase(),
        path,
        parameters,
        requestSchema,
        responses
      });
    }
  }

  return endpoints;
}