import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const postCheckRunPiplineInfo = async (pipelineData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/checks/run`,
      pipelineData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error posting pipeline run:",
      error.response?.data || error.message
    );
    throw error;
  }
};