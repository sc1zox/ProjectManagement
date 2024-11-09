import {Team} from "./team";
import { UserRole as PrismaUserRole } from '@prisma/client';
import {Login} from "./login";


export type UserRole = PrismaUserRole; // import the Enum from prisma to avoid type mismatch

export interface User {
  id: number;
  vorname: string;
  nachname: string;
  role: UserRole;
  teams?: Team[];
  createdAt: Date;
  updatedAt: Date;
  arbeitszeit: number;
  login?: Login;
}
