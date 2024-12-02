import {Team} from './team';
import {Estimation} from './estimation';

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  team?: Team;
  projectStatus: ProjectStatus;
  avgEstimationHours?: number;
  priorityPosition?: number;
  estimations?: Estimation[];
  teamid?: number;
}

export enum ProjectStatus {
  offen = 'offen',
  inBearbeitung = 'inBearbeitung',
  geschlossen = 'geschlossen',
}
