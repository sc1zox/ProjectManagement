export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date| null;
  roadmapId: number| null;
  PriorityPosition?: number | null;
  estimationHours?: number| null;
  createdAt: Date;
  updatedAt: Date;
}