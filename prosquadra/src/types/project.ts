import {User} from './user';
import {Team} from './team';

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  developers: User[];
  team: Team | undefined; // macht developer und team sinn? Wahrscheinlich nicht, aber wird man sehen
  backlogItemsDone: number;
  backlogItemsTotal: number;
  effortEstimation: string;
  estimationDays: number;
}

// nicht final, er modell und db modell sollten zuerst passieren. Bzw sollte wir wissen was von unserer API zurück kommt
