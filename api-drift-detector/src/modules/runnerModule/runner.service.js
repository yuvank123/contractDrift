import { executeEndpoint } from "./apiExecutor.js";

export async function runEndpoints(baseUrl, endpoints) {
  const results = [];

  for (const endpoint of endpoints) {
    const result = await executeEndpoint(baseUrl, endpoint);
    results.push(result);
  }

  return results;
}