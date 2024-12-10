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
}

export enum ProjectStatus {
  offen = 'offen',
  inPlanung = 'inPlanung',
  inBearbeitung = 'inBearbeitung',
  geschlossen = 'geschlossen',
}
