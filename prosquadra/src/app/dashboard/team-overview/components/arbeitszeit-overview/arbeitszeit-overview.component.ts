import {Component, Input} from '@angular/core';
import {User, UserRole} from '../../../../../types/user';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {UserService} from '../../../../../services/user.service';
import {UpdateService} from '../../../../../services/update.service';

@Component({
  selector: 'app-arbeitszeit-overview',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './arbeitszeit-overview.component.html',
  styleUrl: './arbeitszeit-overview.component.scss'
})
export class ArbeitszeitOverviewComponent {

  constructor(private readonly UpdateService: UpdateService) {
  }

  @Input() user?: User;
  arbeitszeit?: number;
  @Input() currentUser?: User;
  protected readonly UserRole = UserRole;

  updateArbeitszeit() {
    if (this.user && this.arbeitszeit !== undefined) {
      try {
        this.UpdateService.updateArbeitszeit(this.user.id, this.arbeitszeit)
      }catch (error){
        console.log("error beim senden der Arbeitszeit")
      }

    }
  }

}
