import Project from "../../models/project.model.js";

export async function createProject(data) {

  const project = await Project.create({
    name: data.name,
    baseUrl: data.baseUrl,
    contractPath: data.contractPath
  });

  return project;
}

export async function fetchProjects() {
  return await Project.find();
}

export async function fetchProject(id) {
  return await Project.findById(id);
}