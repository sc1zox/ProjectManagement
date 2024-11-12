import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-arbeitszeit-overview',
  standalone: true,
  imports: [],
  templateUrl: './arbeitszeit-overview.component.html',
  styleUrl: './arbeitszeit-overview.component.scss'
})
export class ArbeitszeitOverviewComponent {

  @Input() arbeitszeit?: number;

}
