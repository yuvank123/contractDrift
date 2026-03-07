import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const postProjectInfo = async (projectData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/projects`,
      projectData
    );

    return response.data;

  } catch (err) {
    console.error("Error posting project info:", err);
  }
};

export const getProjectInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/projects`);

        return response.data;
    } catch (err) {
        console.error("Error Getting project Info:", err)
    }
}

export const getProjectInfoById = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`);

    if(!response.status){
        console.error("Error Getting project Info by ID:", response.statusText);
    }

    return response.data;
  } catch (error) {
    console.error("Error Getting project Info by ID:", error);
  }
  }
