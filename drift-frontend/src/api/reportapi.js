import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const getReportById = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/${projectId}`);

    return response.data.reports; // important
  } catch (error) {
    console.error(
      "Error fetching report:",
      error.response?.data || error.message
    );
    throw error;
  }
};