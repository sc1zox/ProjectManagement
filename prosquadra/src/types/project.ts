import {User} from './user';
import {Team} from './team';

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  userId: number;
  developers: User[];
  team: Team;
  backlogItemsDone: number;
  backlogItemsTotal: number;
  estimationDays: number;
}

// nicht final, er modell und db modell sollten zuerst passieren. Bzw sollte wir wissen was von unserer API zurück kommt
