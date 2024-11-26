import {Team} from './team';
import {Skill} from './skill';
import {Estimation} from './estimation';
import {Urlaub} from './Urlaub';

export interface User {
  id: number;
  role: UserRole;
  vorname: string;
  nachname: string;
  arbeitszeit?: number;
  skills?: Skill[];
  teams?: Team[];
  urlaubstage?: number;
  urlaub?: Urlaub[];
  estimations?: Estimation[];
}

export enum UserRole {
  PO = 'PO',
  SM = 'SM',
  Developer = 'Developer',
  Admin = 'Admin',
  Bereichsleiter = 'Bereichsleiter'
}

