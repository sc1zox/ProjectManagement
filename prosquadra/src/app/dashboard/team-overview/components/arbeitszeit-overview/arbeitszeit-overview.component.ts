import {Component, Input} from '@angular/core';
import {User, UserRole} from '../../../../../types/user';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SnackbarService} from '../../../../../services/snackbar.service';
import {UserService} from '../../../../../services/user.service';

const defaultUrlaubstage: number = 28;
const defaultArbeitszeit: number = 38.5;

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

  constructor(private readonly UserService: UserService,private readonly SnackBarService: SnackbarService) {
  }

  updateArbeitszeit() {
    this.updateUrlaubstage()
    if (this.arbeitszeit && (this.arbeitszeit < 0 || this.arbeitszeit > 100)) {
      this.SnackBarService.open('Die Arbeitszeit muss zwischen 0 und 100 sein.')
      this.arbeitszeit = undefined;
      return;
    }
    if (this.user && this.arbeitszeit !== undefined) {
      try {
        this.UserService.updateArbeitszeit(this.user.id, this.arbeitszeit);
      } catch (error) {
        this.SnackBarService.open('Error beim Aktualisieren der Arbeitszeit')
      }

    }
  }
  updateUrlaubstage(){
    if(this.arbeitszeit && this.user) {
      let newUrlaubstage: number = defaultUrlaubstage / (defaultArbeitszeit / this.arbeitszeit);
      try {
        this.UserService.updateUrlaubstage(this.user?.id, newUrlaubstage)
      }catch (error){
        this.SnackBarService.open('Error bei der Aktualisierung der Urlaubstage')
      }
    }else{
      this.SnackBarService.open('Die neuen Urlaubstage konnten nicht berechnet werden')
    }
  }

}
