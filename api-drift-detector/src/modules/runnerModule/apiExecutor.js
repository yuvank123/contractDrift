import axios from "axios";

export async function executeEndpoint(baseUrl, endpoint) {

  const url = new URL(endpoint.path, baseUrl).href;

  const start = Date.now();

  try {

    const response = await axios({
      method: endpoint.method,
      url: url,
      params: endpoint.query || {},
      headers: endpoint.headers || {},
      data: endpoint.body || null,
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

    const responseTime = Date.now() - start;

    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: error.response?.status || 0,
      responseTime,
      error: error.message
    };

  }
}