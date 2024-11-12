import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-skill-overview',
  standalone: true,
  imports: [],
  templateUrl: './skill-overview.component.html',
  styleUrl: './skill-overview.component.scss'
})
export class SkillOverviewComponent {
  @Input() userID?: number;
}
