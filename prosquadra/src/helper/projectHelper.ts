import {GanttDate} from '@worktile/gantt';

export function getEarliestStartDate(teams: any[]): GanttDate {
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
