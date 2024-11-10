import {Team} from './team';

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  team?: Team;
  estimationDays?: number;
  estimationHours?: number;
  PriorityPosition?: number;
}

