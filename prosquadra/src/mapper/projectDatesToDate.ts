import {Project} from '../types/project';

export function parseProjects(projects: Project[]): Project[] {
  return projects.map(project => ({
    ...project,
    startDate: project.startDate ? new Date(project.startDate) : undefined,
    endDate: project.endDate ? new Date(project.endDate) : undefined,
  }));
}
export function normalizeDate(date: any): Date {
  if (!(date instanceof Date)) {
    date = new Date(date); // Unsere Dates waren manchmal keine valid Dates?
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
