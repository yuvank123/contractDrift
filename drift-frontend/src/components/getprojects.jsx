import React from "react";

const GetProjects = ({ projects }) => {

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 text-zinc-700 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-zinc-400 mb-2">No projects found</h3>
        <p className="text-sm text-zinc-500">Create your first project to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {projects.map((project) => (
        <div 
          key={project._id} 
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all"
        >
          
         
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
            <p className="text-xs text-zinc-500 font-mono">ID: {project._id}</p>
          </div>

          <div className="space-y-3">
            
           
            <div className="flex items-start">
              <div className="w-28 flex-shrink-0">
                <span className="text-sm font-medium text-zinc-400">Base URL</span>
              </div>
              <div className="flex-1">
                <a 
                  href={project.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 break-all transition-colors"
                >
                  {project.baseUrl}
                </a>
              </div>
            </div>

        
            <div className="flex items-start">
              <div className="w-28 flex-shrink-0">
                <span className="text-sm font-medium text-zinc-400">Contract</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-zinc-300 font-mono break-all">
                  {project.contractPath}
                </span>
              </div>
            </div>

          </div>

        </div>
      ))}

    </div>
  );
};

export default GetProjects;