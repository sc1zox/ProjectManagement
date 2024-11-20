import {Project} from '../types/project';
import {GanttDate, GanttItem} from '@worktile/gantt';

export function projectToGantt(source: Project, teamId: string): GanttItem {
  return {
    id: source.id!.toString(),
    title: source.name,
    start: source.startDate ? Math.floor(new Date(source.startDate).getTime() / 1000) : 0,
    end: source.endDate ? new GanttDate(new Date(source.endDate)).getUnixTime() : 0,
    group_id: teamId,
  };
}
