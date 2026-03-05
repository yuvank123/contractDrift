import SwaggerParser from 'swagger-parser';


export async function parseContract(filePath) {
   try {
    const api = await SwaggerParser.parse(filePath);

    const endpoints = [];

    const paths = api.paths;

    for (const path in paths) {
      const methods = paths[path];

      for (const method in methods) {
        const endpoint = methods[method];

        endpoints.push({
          method: method.toUpperCase(),
          path: path,
          responses: endpoint.responses || {},
        });
      }
    }

    return endpoints;
  } catch (error) {
    console.error("Error parsing contract:", error);
    throw error;
  }
}