import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { Urlaub, vacationState } from '../../../types/urlaub';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { UrlaubPlanungService } from '../../../services/urlaub.planung.service';
import { SpinnerService } from '../../../services/spinner.service';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {ApiError} from '../../../error/ApiError';
import {User} from '../../../types/user';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {UrlaubComponent} from '../../components/urlaub/urlaub.component';
import {MatDivider} from '@angular/material/divider';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-urlaubs-planung',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatIconModule,
    NgProgressbar,
    UrlaubComponent,
    MatDivider,
    MatCard,
    MatCardTitle,
    MatCardContent,
  ],
  templateUrl: './urlaubs-planung.component.html',
  styleUrl: './urlaubs-planung.component.scss'
})
export class UrlaubsPlanungComponent implements OnInit {

  protected isVisible = signal(false);
  currentUser?: User;
  urlaub$ = new BehaviorSubject<Urlaub[]>([]);
  @ViewChild(NgProgressRef) progressBar!: NgProgressRef;

  startDatePicker = new Subject<MatDatepickerInputEvent<any>>();
  endDatePicker = new Subject<MatDatepickerInputEvent<any>>();


  waitingVacations$ = new BehaviorSubject<Urlaub[]>([]);
  acceptedVacations$ = new BehaviorSubject<Urlaub[]>([]);

  constructor(
    private UserService: UserService,
    private readonly SnackBarService: SnackbarService,
    private UrlaubsPlanungService: UrlaubPlanungService,
    private readonly SpinnerService: SpinnerService
  ) { }

  async ngOnInit(): Promise<void> {
    this.SpinnerService.show();

    try {
      this.currentUser = await this.UserService.getCurrentUser();
    } catch (error) {
      this.SnackBarService.open('User konnte nicht abgerufen werden');
    }

    try {
      if (this.currentUser) {
        this.currentUser.urlaub = await this.UserService.getUserUrlaub(this.currentUser);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.SpinnerService.hide();
    }

    if (this.currentUser?.urlaub) {
      this.urlaub$.next(this.currentUser.urlaub);
      this.updateFilteredVacations();
    }

    this.urlaub$.subscribe(() => this.updateFilteredVacations());

    combineLatest([this.startDatePicker, this.endDatePicker]).subscribe(async ([startEvent, endEvent]) => {
      if (startEvent.value && endEvent.value && this.currentUser) {
        if (!await this.UrlaubsPlanungService.checkIfVacationIsValid(startEvent.value, endEvent.value, this.currentUser.id)) {
          this.SnackBarService.open('Urlaub liegt im Projektzeitraum!');
          this.resetDatePickers();
          return;
        }
        try {
          this.progressBar.start();
          let newUrlaub: Urlaub = {
            userId: this.currentUser.id,
            startDatum: startEvent.value,
            endDatum: endEvent.value,
            stateOfAcception: vacationState.Waiting
          };

          const urlaubMitId: Urlaub = await this.UserService.sendUrlaubRequest(
            this.currentUser.id,
            startEvent.value,
            endEvent.value,
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
            this.SnackBarService.open('Urlaub existiert bereits');
          } else {
            this.resetDatePickers();
            this.SnackBarService.open('Urlaub konnte nicht eingetragen werden');
          }
        } finally {
          this.progressBar.complete();
        }
      }
    });
  }

  deleteUrlaub(urlaub: Urlaub) {
    this.progressBar.start();
    this.UserService.deleteUrlaub(urlaub).then(() => {
      const updatedUrlaub = this.urlaub$.getValue().filter(u => u !== urlaub);
      this.urlaub$.next(updatedUrlaub);
      this.SnackBarService.open('Urlaub wurde gelöscht');
    }).catch(() => {
      this.SnackBarService.open('Urlaub konnte nicht gelöscht werden');
    }).finally(() => {
      this.progressBar.complete();
    });
  }

  resetDatePickers() {
    this.startDatePicker.next({} as MatDatepickerInputEvent<any>);
    this.endDatePicker.next({} as MatDatepickerInputEvent<any>);
  }

  updateFilteredVacations() {
    const vacations = this.urlaub$.getValue();
    this.waitingVacations$.next(vacations.filter(v => v.stateOfAcception === vacationState.Waiting));
    this.acceptedVacations$.next(vacations.filter(v => v.stateOfAcception === vacationState.Accepted));
  }
}
