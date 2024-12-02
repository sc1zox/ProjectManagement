import {Component, Input} from '@angular/core';
import {NxPuffLoaderComponent} from '@ngeenx/nx-angular-svg-loaders';
import {SpinnerService} from '../../../services/spinner.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NxPuffLoaderComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {

  constructor(public spinnerService: SpinnerService) {
  }

}
