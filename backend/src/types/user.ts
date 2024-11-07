import { Team } from "./team";


export enum UserRole {
  PO = 'Product Owner',
  SM = 'Scrum Master',
  Developer = 'Developer',
  Admin = 'Admin'
}

export interface User {
  id: number | null;
  username: string;
  role: UserRole;
  teams?: Team[];
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  password: string;
}
