import {User} from './user';
import {Roadmap} from './roadmap';

export interface Team {
  id: number;
  name: string;
  members: User[];
  roadmap?: Roadmap;
}
