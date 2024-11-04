import {User} from './user';
import {Roadmap} from './roadmap';
import {Project} from './project';

export interface Team {
  id: number;
  name: string;
  members: User[];
  roadmap?: Roadmap;
  projects?: Project[];
}
