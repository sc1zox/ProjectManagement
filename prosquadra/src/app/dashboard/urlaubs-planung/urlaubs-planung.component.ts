import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {CommonModule} from '@angular/common';
import {MatFabButton} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatLabel} from '@angular/material/form-field';
import {BehaviorSubject, combineLatest, map, Subject} from 'rxjs';
import {User} from '../../../types/user';
import {UserService} from '../../../services/user.service';
import {Urlaub, vacationState} from '../../../types/urlaub';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatIconModule} from '@angular/material/icon';
import {UrlaubPlanungService} from '../../../services/urlaub.planung.service';
import {ApiError} from '../../../error/ApiError';
import {SpinnerService} from '../../../services/spinner.service';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';
import {UrlaubComponent} from '../../components/urlaub/urlaub.component';


@Component({
  selector: 'app-urlaubs-planung',
  standalone: true,
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatLabel,
    MatIconModule,
    MatFabButton,
    NgProgressbar,
    UrlaubComponent,
  ],
  templateUrl: './urlaubs-planung.component.html',
  styleUrl: './urlaubs-planung.component.scss'
})
export class UrlaubsPlanungComponent implements OnInit {

  protected isVisible = signal(false);
  currentUser?: User;
  urlaub$ = new BehaviorSubject<Urlaub[]>([]);
  @ViewChild(NgProgressRef) progressBar!: NgProgressRef;

// https://stackoverflow.com/questions/63823557/angular-material-datepickerrange-get-value-on-change
  constructor(private UserService: UserService, private readonly SnackBarService: SnackbarService, private UrlaubsPlanungService: UrlaubPlanungService,private readonly SpinnerService: SpinnerService,) {
  }

  startDatePicker = new Subject<MatDatepickerInputEvent<any>>();
  endDatePicker = new Subject<MatDatepickerInputEvent<any>>();

  async ngOnInit(): Promise<void> {
    this.SpinnerService.show();

    try {
      this.currentUser = await this.UserService.getCurrentUser();
    }catch (error){
      this.SnackBarService.open('User konnte nicht abgerufen werden')
    }

    try{
      if(this.currentUser) {
        this.currentUser.urlaub = await this.UserService.getUserUrlaub(this.currentUser);
      }
    }catch (error){
      console.log(error)
    }finally {
      this.SpinnerService.hide();
    }

    const dateChange$ = combineLatest([this.startDatePicker, this.endDatePicker]).pipe(
      map(([a$, b$]) => ({
        start: a$,
        end: b$
      }))
    );

    if (this.currentUser?.urlaub) {
      this.urlaub$.next(this.currentUser.urlaub); //das hier hält den gecachten User
    }


    dateChange$.subscribe(async (data) => {
      if (data.start.value && data.end.value && this.currentUser) {
        if (!await this.UrlaubsPlanungService.checkIfVacationIsValid(data.start.value, data.end.value, this.currentUser.id)) {
          this.SnackBarService.open('Urlaub liegt im Projektzeitraum!');
          this.resetDatePickers();
          return;
        }
        try {
          this.progressBar.start();
          let newUrlaub: Urlaub = {
            userId: this.currentUser.id,
            startDatum: data.start.value,
            endDatum: data.end.value,
            stateOfAcception: vacationState.Waiting
          };

          const urlaubMitId: Urlaub = await this.UserService.sendUrlaubRequest(
            this.currentUser.id,
            data.start.value,
            data.end.value,
            vacationState.Waiting,
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
            this.progressBar.complete();
          }
        } finally {
          this.progressBar.complete();
        }
      }
    });
  }

  async deleteUrlaub(urlaub: Urlaub) {
    this.progressBar.start();
    try {
      await this.UserService.deleteUrlaub(urlaub);
      const updatedUrlaub = this.urlaub$.getValue().filter(u => u !== urlaub);
      this.urlaub$.next(updatedUrlaub);
      this.SnackBarService.open('Urlaub wurde gelöscht');
    } catch (error) {
      this.SnackBarService.open('Urlaub konnte nicht gelöscht werden');
      this.progressBar.complete();
    }finally {
      this.progressBar.complete();
    }
  }

  resetDatePickers() {
    this.startDatePicker.next({} as MatDatepickerInputEvent<any>);
    this.endDatePicker.next({} as MatDatepickerInputEvent<any>);
  }

}
