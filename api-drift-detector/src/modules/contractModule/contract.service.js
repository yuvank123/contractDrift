import { parseContract } from "./contractParser.js";

export async function parseContractService(filePath) {
  if (!filePath) {
    throw new Error("File path is required");
  }

  const endpoints = await parseContract(filePath);

  return endpoints;
}