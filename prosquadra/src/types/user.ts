import {Team} from './team';
import {Skill} from './skill';

export interface User {
  id: number;
  role: UserRole;
  vorname: string;
  nachname: string;
  arbeitszeit?: number;
  skills?: Skill[];
  team?: Team[];
  urlaubstage?: number;
}
export enum UserRole {
  PO = 'PO',
  SM = 'SM',
  Developer = 'Developer',
  Admin = 'Admin',
  Bereichsleiter = 'Bereichsleiter'
}

