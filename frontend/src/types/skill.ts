import {User} from './user';

export interface Skill {
  id?: number;
  name: string;
  users?: User[];
}
