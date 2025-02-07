import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Urlaub, vacationState} from '../../../types/urlaub';
import {slideIn} from '../../../animations/slideIn';
import {UserRole} from '../../../types/user';

@Component({
  selector: 'app-urlaub',
  standalone: true,
  imports: [
    DatePipe,
    MatFabButton,
    MatIcon,
    NgIf,
  ],
  animations: [
    slideIn
  ],
  templateUrl: './urlaub.component.html',
  styleUrl: './urlaub.component.scss'
})
export class UrlaubComponent {

  @Input() urlaub?: Urlaub;
  @Output() delete = new EventEmitter<Urlaub>();
  @Output() accept = new EventEmitter<Urlaub>();
  @Output() deny = new EventEmitter<Urlaub>();
  @Input() mode?: string;


  deleteUrlaub() {
    this.delete.emit(this.urlaub);
  }

  acceptUrlaub(){
    this.accept.emit(this.urlaub)
  }

  denyUrlaub(){
    this.deny.emit(this.urlaub)
  }

  protected readonly UserRole = UserRole;
  protected readonly vacationState = vacationState;
}
