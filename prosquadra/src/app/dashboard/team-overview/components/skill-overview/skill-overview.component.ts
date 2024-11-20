import {Component, Input} from '@angular/core';
import {Skill} from '../../../../../types/skill';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-skill-overview',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './skill-overview.component.html',
  styleUrl: './skill-overview.component.scss'
})
export class SkillOverviewComponent {
  @Input() userSkills?: Skill[];
}
