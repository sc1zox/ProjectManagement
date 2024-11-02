import {Team} from './team';

export interface User {
  role?: UserRole;
  id: number | null;
  vorname: string;
  nachname: string;
  skills?: string[];
  team?: Team[];
  token?: string;
}
export enum UserRole {
  PO = 'Product Owner',
  SM = 'Scrum Master',
  Developer = 'Developer',
  Admin = 'Admin'
}
