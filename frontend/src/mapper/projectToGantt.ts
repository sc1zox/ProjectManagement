import { Project } from '../types/project';
import { GanttItem } from '@worktile/gantt';

export interface ExtendedGanttItem extends GanttItem {
  duration: number;
}

export function projectToGantt(source: Project, teamId: string): ExtendedGanttItem {
  const startDate = source.startDate ? new Date(source.startDate) : null;
  const endDate = source.endDate ? new Date(source.endDate) : null;

  let duration = 0;
  if (startDate && endDate) {
    const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    duration = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24)); // in Tagen
  }

  return {
    id: source.id!.toString(),
    title: source.name,
    start: startDate ? Math.floor(startDate.getTime() / 1000) : 0, // Unix-Zeit in Sekunden
    end: endDate ? Math.floor(endDate.getTime() / 1000) : 0,       // Unix-Zeit in Sekunden
    duration,
    group_id: teamId,
  };
}
