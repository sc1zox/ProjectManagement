import {GanttDate} from '@worktile/gantt';
import {Team} from '../types/team';
import {Project, ProjectStatus} from '../types/project';
import {UserRole} from '../types/user';
import {normalizeDate, parseProjects} from '../mapper/projectDatesToDate';

export function getEarliestStartAndEndDate(teams: Team[]): { earliest: GanttDate; latest: GanttDate } {
  let earliestStartDate;
  let latestEndDate;
  for (const team of teams) {
    if (team.projects && team.projects.length > 0) {
      for (const project of team.projects) {
        const projectStartDate = project.startDate ? new Date(project.startDate) : null;
        const projectEndDate = project.endDate ? new Date(project.endDate) : null;

        if (projectStartDate && (!earliestStartDate || projectStartDate < earliestStartDate)) {
          earliestStartDate = projectStartDate;
        }
        if (projectEndDate && (!latestEndDate || projectEndDate > latestEndDate)) {
          latestEndDate = projectEndDate;
        }
      }
    }
  }
  return {
    earliest: new GanttDate(earliestStartDate),
    latest: new GanttDate(latestEndDate)
  };
}

export function isProjectEstimated(project: Project) {
  return project.estimations?.length === project.team?.members?.filter(member => member.role === UserRole.Developer).length
}

export function isProjectEstimatedAndNotInPlanningOrClosed(project: Project) {
  return project.estimations?.length === project.team?.members?.filter(member => member.role === UserRole.Developer).length && (project.projectStatus !== ProjectStatus.inBearbeitung && project.projectStatus !== ProjectStatus.geschlossen)
}

export function getProjectClasses(project: Project, selectedProject: Project | undefined): {
  [key: string]: boolean | null
} {
  const projectEndDate = project.endDate ? normalizeDate(new Date(project.endDate)) : null;
  const today = normalizeDate(new Date())
  return {
    'selected': project === selectedProject,
    'offen': project.projectStatus === ProjectStatus.offen,
    'in-planung': project.projectStatus === ProjectStatus.inPlanung,
    'in-bearbeitung': project.projectStatus === ProjectStatus.inBearbeitung,
    'geschlossen': project.projectStatus === ProjectStatus.geschlossen,
  };
}

export function setOverdueClassIcon(project: Project, selectedProject: Project | undefined) {
  const projectEndDate = project.endDate ? normalizeDate(new Date(project.endDate)) : null;
  const today = normalizeDate(new Date())
  return {
    'overdue-icon-on': project.projectStatus !== ProjectStatus.geschlossen && (projectEndDate && projectEndDate <= today),
  }
}

export function setOverdueClassName(project: Project, selectedProject: Project | undefined) {
  const projectEndDate = project.endDate ? normalizeDate(new Date(project.endDate)) : null;
  const today = normalizeDate(new Date())
  return {
    'project-name': project.projectStatus !== ProjectStatus.geschlossen && (projectEndDate && projectEndDate <= today)
  }
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

export function isStartDateInRange(projects: Project[], startDate: Date, selectedProject: Project): boolean {
  const projectsWithoutItself = projects.filter(project => project.id !== selectedProject.id);
  const projectsMapped = parseProjects(projectsWithoutItself);

  const result = projectsMapped.filter(
    project => project.startDate !== null && project.endDate !== null
  );
  const normalizedStartDate = normalizeDate(startDate);

  return result.some(range => {
    const normalizedRangeStart = normalizeDate(range.startDate as Date);
    const normalizedRangeEnd = normalizeDate(range.endDate as Date);
    return normalizedStartDate >= normalizedRangeStart && normalizedStartDate <= normalizedRangeEnd;
  });
}
