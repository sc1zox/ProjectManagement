import {GanttDate} from '@worktile/gantt';
import {Team} from '../types/team';

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
