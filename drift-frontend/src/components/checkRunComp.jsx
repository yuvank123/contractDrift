import React, { useState } from "react";
import { getProjectInfoById } from "../api/projectinfo";
import { postCheckRunPiplineInfo } from "../api/checkRunPipline";
import { useNavigate } from "react-router-dom";

const CheckRunComp = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!projectId.trim()) {
      setError("Project ID is required");
      return;
    }

    try {
      setIsRunning(true);

      const projectResponse = await getProjectInfoById(projectId);

      if (!projectResponse) {
        setError("Project not found");
        return;
      }

      const projectData = projectResponse.project || projectResponse;

      if (!projectData.contractPath || !projectData.baseUrl) {
        setError("Project data missing required fields");
        return;
      }

      const pipelinePayload = {
        projectId: projectId,
        filePath: projectData.contractPath,
        baseUrl: projectData.baseUrl,
      };

      console.log("Sending payload:", pipelinePayload);

      const response = await postCheckRunPiplineInfo(pipelinePayload);

      console.log("Pipeline executed successfully:", response);

      // Navigate to pipeline results page
      navigate(`/pipeline-results/${projectId}`);

    } catch (error) {
      console.error(
        "Pipeline execution failed:",
        error?.response?.data || error.message
      );
      setError(
        error?.response?.data?.message || 
        "Pipeline execution failed. Please try again."
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-white text-2xl font-semibold text-center">
          Run Contract Check
        </h2>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isRunning}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-2 rounded-md font-medium transition"
        >
          {isRunning ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Pipeline...
            </span>
          ) : (
            "Run Check"
          )}
        </button>

        {isRunning && (
          <p className="text-center text-gray-400 text-sm">
            This may take a few moments...
          </p>
        )}
      </form>
    </div>
  );
};

export default CheckRunComp;