import React, { useState, useEffect } from "react";
import { postProjectInfo, getProjectInfo } from "../api/projectinfo.js";
import GetProjects from "./getprojects.jsx";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectName, setProjectName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [contractUrl, setContractUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.baseUrl?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    const data = await getProjectInfo();
    setProjects(data.projects);
    setFilteredProjects(data.projects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      name: projectName,
      baseUrl: baseUrl,
      contractPath: contractUrl
    };

    try {
      await postProjectInfo(data);
      await fetchProjects();

      setProjectName("");
      setBaseUrl("");
      setContractUrl("");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">


      <div className="w-1/2 p-8 overflow-y-auto">
        <div className="max-w-xl">


          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">Create Project</h1>
            <p className="text-zinc-400">Configure your project settings</p>
          </div>


          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-2xl">
            <form onSubmit={handleSubmit}>


              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Base URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>


              <div className="mb-8">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Contract Path
                </label>
                <input
                  type="text"
                  placeholder="/api/contract"
                  value={contractUrl}
                  onChange={(e) => setContractUrl(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                  {isSubmitting ? "Creating Project..." : "Create Project"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/parsing-pipeline")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                  Use Parsing Pipeline
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>


      <div className="w-1/2 border-l border-zinc-800 flex flex-col">


        <div className="p-8 pb-6 bg-zinc-950 border-b border-zinc-800">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white mb-2">Projects</h2>
            <p className="text-zinc-400 text-sm">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>


          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>


        <div
          className="flex-1 overflow-y-auto px-8 py-6"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; // Chrome, Safari, Opera
            }
          `}</style>

          <GetProjects projects={filteredProjects} />
        </div>

      </div>

    </div>
  );
};

export default ProjectForm;