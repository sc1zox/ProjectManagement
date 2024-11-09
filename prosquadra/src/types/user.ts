import {Team} from './team';

export interface User {
  id: number;
  role: UserRole;
  vorname: string;
  nachname: string;
  arbeitszeit?: number;
  skills?: string[];
  team?: Team[];
}
export enum UserRole {
  PO = 'PO',
  SM = 'SM',
  Developer = 'Developer',
  Admin = 'Admin'
}

