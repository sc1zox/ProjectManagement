export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  userId: number;
  backlogItemsDone: number;
  backlogItemsTotal: number;
}

// nicht final, er modell und db modell sollten zuerst passieren. Bzw sollte wir wissen was von unserer API zurück kommt
