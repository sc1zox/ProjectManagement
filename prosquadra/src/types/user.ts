import {Team} from './team';

export interface User {
  role: UserRole;
  id: number | null;
  vorname: string;
  nachname: string;
  password: string;
  skills?: string[];
  team?: Team[];
  token?: string;
}
export enum UserRole {
  PO = 'PO',
  SM = 'SM',
  Developer = 'Developer',
  Admin = 'Admin'
}

