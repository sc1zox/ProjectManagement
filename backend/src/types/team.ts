import {User} from './user';
import {Roadmap} from './roadmap';
import {Project} from './project';

export interface Team {
  id: number;
  name: string;
  members?: User[];
  roadmap?: Roadmap | null;
  roadmapId: number | null;
  projects?: Project[];
}
