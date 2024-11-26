import {Component, OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatError, MatLabel} from '@angular/material/form-field';
import {combineLatest, map, Subject} from 'rxjs';
import {User} from '../../../types/user';
import {UserService} from '../../../services/user.service';

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

  ],
  templateUrl: './urlaubs-planung.component.html',
  styleUrl: './urlaubs-planung.component.scss'
})
export class UrlaubsPlanungComponent implements OnInit {

  currentUser?: User;

// https://stackoverflow.com/questions/63823557/angular-material-datepickerrange-get-value-on-change
  constructor(private UserService: UserService) {
  }

  startDatePicker = new Subject<MatDatepickerInputEvent<any>>();
  endDatePicker = new Subject<MatDatepickerInputEvent<any>>();

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.UserService.getCurrentUser();
    const dateChange$ = combineLatest([this.startDatePicker, this.endDatePicker]).pipe(
      map(([a$, b$]) => ({
        start: a$,
        end: b$
      }))
    );

    dateChange$.subscribe((data) => {
      if (data.start.value && data.end.value && this.currentUser) {
        console.log('User has picked both ranges!');
        this.UserService.sendUrlaubRequest(this.currentUser?.id,data.start.value,data.end.value)
      }
    });
  }
}
