import {GanttDate} from '@worktile/gantt';
import {Team} from '../types/team';
import {Project, ProjectStatus} from '../types/project';
import {UserRole} from '../types/user';

export function getEarliestStartDate(teams: Team[]): GanttDate {
  let earliestStartDate;
  for (const team of teams) {
    if (team.projects && team.projects.length > 0) {
      for (const project of team.projects) {
        const projectStartDate = project.startDate ? new Date(project.startDate) : null;

        if (projectStartDate && (!earliestStartDate || projectStartDate < earliestStartDate)) {
          earliestStartDate = projectStartDate;
        }
      }
    }
  }

  return new GanttDate(earliestStartDate);
}

export function isProjectEstimated(project: Project){
  // console.log(project,project.estimations?.length,project.team?.members?.filter(member => member.role === UserRole.Developer).length)
  return project.estimations?.length === project.team?.members?.filter(member => member.role === UserRole.Developer).length
}

export function isProjectEstimatedAndNotInPlanningOrClosed(project: Project){
  return project.estimations?.length === project.team?.members?.filter(member => member.role === UserRole.Developer).length && (project.projectStatus !== ProjectStatus.inBearbeitung && project.projectStatus !== ProjectStatus.geschlossen)
}

export function getProjectClasses(project: any,selectedProject: Project | undefined): { [key: string]: boolean } {
  return {
    'selected': project === selectedProject,
    'offen': project.projectStatus === ProjectStatus.offen,
    'in-planung': project.projectStatus === ProjectStatus.inPlanung,
    'in-bearbeitung': project.projectStatus === ProjectStatus.inBearbeitung,
    'geschlossen': project.projectStatus === ProjectStatus.geschlossen
  };
}

export function handleDisabledTooltip(project: Project) {
  return project.projectStatus !== ProjectStatus.inBearbeitung;
}

export function handleDisabledStatus(project: Project, status: ProjectStatus): boolean {
  switch (project.projectStatus) {

    case ProjectStatus.offen:

      if (isProjectEstimated(project)) {
        return status === ProjectStatus.inBearbeitung;
      } else {
        return status !== ProjectStatus.offen;
      }

    case ProjectStatus.inPlanung:
      return false;

    case ProjectStatus.inBearbeitung:
      return false;

    case ProjectStatus.geschlossen:
      return false;

    default:
      return false;
  }
}
