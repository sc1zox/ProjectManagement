import {User} from "./user";
import {vacationState} from "@prisma/client";

export interface Urlaub {
    id?: number;
    userId: number;
    user?: User;
    startDatum: Date;
    endDatum: Date;
    stateOfAcception: vacationState;
}
