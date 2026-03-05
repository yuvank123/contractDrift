import Contract from "../../models/contract.model.js";
import { parseContract } from "./contractParser.js";

export async function parseContractService(data) {

  const { filePath, projectId } = data;

  const contract = await Contract.create({
    projectId,
    filePath
  });

  const endpoints = await parseContract(filePath);

  return {
    contract,
    endpoints
  };
}