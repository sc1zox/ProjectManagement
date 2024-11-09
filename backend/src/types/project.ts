export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  teamId: number | null;
  roadmapId: number | null;
  estimationDays: number;
  createdAt: Date;
  updatedAt: Date;
}