import {Team} from './team';

export interface User {
  role?: UserRole;
  id: number | null;
  vorname: string;
  nachname: string;
  arbeitszeit?: number; // Muss noch mit backend shema verbunden werden
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

