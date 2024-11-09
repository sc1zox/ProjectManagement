import {Team} from "./team";

export enum UserRole {
  PO = 'Product Owner',
  SM = 'Scrum Master',
  Developer = 'Developer',
  Admin = 'Admin'
}

export interface User {
  id: number | null;
  vorname: string;
  nachname: string;
  role: UserRole;
  teams?: Team[];
  token?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  password: string;
  arbeitszeit: number;
}
