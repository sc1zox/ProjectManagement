import {Component, Input} from '@angular/core';
import {User, UserRole} from '../../../../../types/user';
import {NgIf} from '@angular/common';
import {UpdateService} from '../../../../../services/update.service';
import {FormsModule} from '@angular/forms';
import {SnackbarService} from '../../../../../services/snackbar.service';

@Component({
  selector: 'app-arbeitszeit-overview',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './arbeitszeit-overview.component.html',
  styleUrl: './arbeitszeit-overview.component.scss'
})
export class ArbeitszeitOverviewComponent {

  @Input() user?: User;
  arbeitszeit?: number;
  @Input() currentUser?: User;
  protected readonly UserRole = UserRole;

  constructor(private readonly UpdateService: UpdateService,private readonly SnackBarService: SnackbarService) {
  }

  updateArbeitszeit() {
    if (this.arbeitszeit && (this.arbeitszeit < 0 || this.arbeitszeit > 168)) {
      this.SnackBarService.open('Die Arbeitszeit muss zwischen 0 und 168 sein.')
      this.arbeitszeit = undefined;
      return;
    }
    if (this.user && this.arbeitszeit !== undefined) {
      try {
        this.UpdateService.updateArbeitszeit(this.user.id, this.arbeitszeit)
      } catch (error) {
        console.log("error beim senden der Arbeitszeit")
      }

    }
  }

}
