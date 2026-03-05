import axios from "axios";

export async function executeEndpoint(baseUrl, endpoint) {
  const url = `${baseUrl}${endpoint.path}`;

  const start = Date.now();

  try {
    const response = await axios({
      method: endpoint.method,
      url: url,
      timeout: 5000
    });

    const responseTime = Date.now() - start;

    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: response.status,
      responseTime,
      data: response.data
    };

  } catch (error) {
    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: error.response?.status || "FAILED",
      error: error.message
    };
  }
}