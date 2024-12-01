import {Team} from "./team";
import {UserRole as PrismaUserRole} from '@prisma/client';
import {Login} from "./login";
import {Urlaub} from "./Urlaub";


export type UserRole = PrismaUserRole; // import the Enum from prisma to avoid type mismatch

export interface User {
  id: number;
  vorname: string;
  nachname: string;
  role: UserRole;
  teams?: Team[];
  createdAt: Date;
  updatedAt: Date;
  urlaub?: Urlaub[]
  arbeitszeit: number;
  login?: Login;
  teamId?: number;
}
