import {Project} from '../types/project';

export function parseProjects(projects: Project[]): Project[] {
  return projects.map(project => ({
    ...project,
    startDate: project.startDate ? new Date(project.startDate) : undefined,
    endDate: project.endDate ? new Date(project.endDate) : undefined,
  }));
}
