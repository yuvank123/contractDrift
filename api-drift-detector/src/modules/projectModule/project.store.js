const projects = [];

export function saveProject(project) {
  projects.push(project);
  return project;
}

export function getProjects() {
  return projects;
}

export function getProjectById(id) {
  return projects.find(p => p.id === id);
}