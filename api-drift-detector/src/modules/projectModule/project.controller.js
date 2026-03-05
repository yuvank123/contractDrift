import {
  createProject,
  fetchProjects,
  fetchProject
} from "./project.service.js";

export async function createProjectController(req, res) {

  try {

    const project = await createProject(req.body);

    res.status(201).json({
      success: true,
      project
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
}

export async function getProjectsController(req, res) {

  const projects = await fetchProjects();

  res.json({
    success: true,
    projects
  });

}

export async function getProjectController(req, res) {

  const project = await fetchProject(req.params.id);

  res.json({
    success: true,
    project
  });

}