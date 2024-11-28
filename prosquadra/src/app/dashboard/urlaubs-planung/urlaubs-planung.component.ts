import {Component, OnInit, signal} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {CommonModule} from '@angular/common';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatError, MatLabel} from '@angular/material/form-field';
import {BehaviorSubject, combineLatest, map, Subject} from 'rxjs';
import {User} from '../../../types/user';
import {UserService} from '../../../services/user.service';
import {Urlaub} from '../../../types/urlaub';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatIconModule} from '@angular/material/icon';
import {slideIn} from '../../../animations/slideIn';
import {UrlaubPlanungService} from '../../../services/urlaub.planung.service';
import {ApiError} from '../../../../error/ApiError';


@Component({
  selector: 'app-urlaubs-planung',
  standalone: true,
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButton,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatError,
    MatLabel,
    MatIconModule,
    MatFabButton,
  ],
  animations: [
    slideIn
  ],
  templateUrl: './urlaubs-planung.component.html',
  styleUrl: './urlaubs-planung.component.scss'
})
export class UrlaubsPlanungComponent implements OnInit {

  protected isVisible = signal(false);
  currentUser?: User;
  urlaub$ = new BehaviorSubject<Urlaub[]>([]);

// https://stackoverflow.com/questions/63823557/angular-material-datepickerrange-get-value-on-change
  constructor(private UserService: UserService, private readonly SnackBarService: SnackbarService, private UrlaubsPlanungService: UrlaubPlanungService) {
  }

  startDatePicker = new Subject<MatDatepickerInputEvent<any>>();
  endDatePicker = new Subject<MatDatepickerInputEvent<any>>();

  async ngOnInit(): Promise<void> {

    try {
      this.currentUser = await this.UserService.getCurrentUser();
    }catch (error){
      this.SnackBarService.open('User konnte nicht abgerufen werden')
    }

    const dateChange$ = combineLatest([this.startDatePicker, this.endDatePicker]).pipe(
      map(([a$, b$]) => ({
        start: a$,
        end: b$
      }))
    );

    if (this.currentUser?.urlaub) {
      this.urlaub$.next(this.currentUser.urlaub);
    }

    dateChange$.subscribe(async (data) => {
      if (data.start.value && data.end.value && this.currentUser) {
        if (!await this.UrlaubsPlanungService.checkIfVacationIsValid(data.start.value, data.end.value, this.currentUser.id)) {
          this.SnackBarService.open('Urlaub liegt im Projektzeitraum!');
          this.resetDatePickers();
          return;
        }
        try {
          let newUrlaub: Urlaub = {
            userId: this.currentUser.id,
            startDatum: data.start.value,
            endDatum: data.end.value,
          };

          const urlaubMitId: Urlaub = await this.UserService.sendUrlaubRequest(
            this.currentUser.id,
            data.start.value,
            data.end.value
          );
          newUrlaub.id = urlaubMitId.id;
          const updatedUrlaub = [...this.urlaub$.getValue(), newUrlaub];
          this.urlaub$.next(updatedUrlaub);
          this.isVisible.set(!this.isVisible());
          this.resetDatePickers();
          this.SnackBarService.open('Urlaub wurde erfolgreich eingetragen');
        } catch (error: unknown) {
          if (error instanceof ApiError && error.code === 409) {
            this.resetDatePickers();
            this.SnackBarService.open('Urlaub exisitert bereits');
          } else {
            this.resetDatePickers();
            this.SnackBarService.open('Urlaub konnte nicht eingetragen werden');
          }
        }
      }
    });
  }


  async deleteUrlaub(urlaub: Urlaub) {
    try {
      await this.UserService.deleteUrlaub(urlaub);
      const updatedUrlaub = this.urlaub$.getValue().filter(u => u !== urlaub);
      this.urlaub$.next(updatedUrlaub);
      this.SnackBarService.open('Urlaub wurde gelöscht');
    } catch (error) {
      this.SnackBarService.open('Urlaub konnte nicht gelöscht werden');
    }
  }

  resetDatePickers() {
    this.startDatePicker.next({} as MatDatepickerInputEvent<any>);
    this.endDatePicker.next({} as MatDatepickerInputEvent<any>);
  }

}
