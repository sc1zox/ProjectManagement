import {Team} from './team';
import {Skill} from './skill';
import {Estimation} from './estimation';

export interface User {
  id: number;
  role: UserRole;
  vorname: string;
  nachname: string;
  arbeitszeit?: number;
  skills?: Skill[];
  teams?: Team[];
  urlaubstage?: number;
  estimations?: Estimation[];
}

export enum UserRole {
  PO = 'PO',
  SM = 'SM',
  Developer = 'Developer',
  Admin = 'Admin',
  Bereichsleiter = 'Bereichsleiter'
}

