import { executeEndpoint } from "./apiExecutor.js";

export async function runEndpoints(baseUrl, endpoints) {

  const tasks = endpoints.map(endpoint =>
    executeEndpoint(baseUrl, endpoint)
  );

  const results = await Promise.all(tasks);

  return results;
}