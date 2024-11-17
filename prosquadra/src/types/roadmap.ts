import {Project} from './project';
import {Team} from './team';

export interface Roadmap {
    id?: number;
    projects: Project[]
    teams?: Team;
}
