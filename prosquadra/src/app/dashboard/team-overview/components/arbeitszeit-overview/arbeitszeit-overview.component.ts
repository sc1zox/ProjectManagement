import {Component, Input, OnInit} from '@angular/core';
import {User, UserRole} from '../../../../../types/user';
import {AsyncPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SnackbarService} from '../../../../../services/snackbar.service';
import {UserService} from '../../../../../services/user.service';
import {BehaviorSubject} from 'rxjs';

const defaultUrlaubstage: number = 28;
const defaultArbeitszeit: number = 38.5;

@Component({
  selector: 'app-arbeitszeit-overview',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './arbeitszeit-overview.component.html',
  styleUrl: './arbeitszeit-overview.component.scss'
})
export class ArbeitszeitOverviewComponent implements OnInit{

  @Input() user?: User;
  arbeitszeit = new BehaviorSubject<number>(0);
  @Input() currentUser?: User;
  protected readonly UserRole = UserRole;

  constructor(private readonly UserService: UserService,private readonly SnackBarService: SnackbarService) {
  }

  ngOnInit() {
    if (this.user?.arbeitszeit) {
      this.arbeitszeit.next(this.user.arbeitszeit);
    }
  }


  updateArbeitszeit(value: number) {
    if (value < 0 || value > 100) {
      this.SnackBarService.open('Die Arbeitszeit muss zwischen 0 und 100 sein.')
      return;
    }
    this.arbeitszeit.next(value);
    this.updateUrlaubstage();
    if (this.user && this.arbeitszeit) {
      try {
        this.UserService.updateArbeitszeit(this.user.id, this.arbeitszeit.value);
      } catch (error) {
        this.SnackBarService.open('Error beim Aktualisieren der Arbeitszeit')
      }

    }
  }
  updateUrlaubstage(){
    if(this.arbeitszeit && this.user) {
      let newUrlaubstage: number = defaultUrlaubstage / (defaultArbeitszeit / this.arbeitszeit.value);
      try {
        if(this.arbeitszeit.value !== null) {
          this.UserService.updateUrlaubstage(this.user?.id, newUrlaubstage);
        }
        this.user.urlaubstage = Math.trunc(newUrlaubstage);
        this.user.arbeitszeit = this.arbeitszeit.value;
      }catch (error){
        this.SnackBarService.open('Error bei der Aktualisierung der Urlaubstage')
      }
    }else{
      this.SnackBarService.open('Die neuen Urlaubstage konnten nicht berechnet werden')
    }
  }

}
