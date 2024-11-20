import {Team} from './team';

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  team?: Team;
  estimationHours?: number;
  PriorityPosition?: number;
}

