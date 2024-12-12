import {User} from "./user";

export interface Urlaub {
  id?: number;
  userId: number;
  user?: User;
  startDatum: Date;
  endDatum: Date;
  stateOfAcception: vacationState;
}

export enum vacationState {
  Accepted = 'Accepted',
  Waiting = 'Waiting',
  Denied = 'Denied',
}
