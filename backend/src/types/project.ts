export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date| null;
  roadmapId: number| null;
  estimationDays: number| null;
  createdAt: Date;
  updatedAt: Date;
}