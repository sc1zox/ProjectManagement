import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UserRole } from '../../../../../types/user';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { UserService } from '../../../../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ArbeitszeitModalComponent } from '../arbeitszeit-modal/arbeitszeit-modal.component';

const defaultUrlaubstage: number = 28;
const defaultArbeitszeit: number = 38.5;

@Component({
  selector: 'app-arbeitszeit-overview',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    AsyncPipe,
    MatInput,
    MatButton
  ],
  templateUrl: './arbeitszeit-overview.component.html',
  styleUrls: ['./arbeitszeit-overview.component.scss']
})
export class ArbeitszeitOverviewComponent implements OnInit {

  @Input() user?: User;
  arbeitszeit = new BehaviorSubject<number>(0);
  @Input() currentUser?: User;
  protected readonly UserRole = UserRole;

  constructor(
    private readonly UserService: UserService,
    private readonly SnackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.user?.arbeitszeit) {
      this.arbeitszeit.next(this.user.arbeitszeit);
    }
  }


  updateArbeitszeit(value: number) {
    if (isNaN(value) || value < 0 || value > 100 || value === null) {
      this.SnackBarService.open('The working time must be between 0 and 100.');
      return;
    }
    this.arbeitszeit.next(value);
    this.updateUrlaubstage();

    if (this.user) {
      try {
        this.UserService.updateArbeitszeit(this.user.id, this.arbeitszeit.value);
      } catch (error) {
        this.SnackBarService.open('Error when updating the working time');
      }
    }
  }

  updateUrlaubstage() {
    if (this.arbeitszeit && this.user) {
      let newUrlaubstage: number = defaultUrlaubstage / (defaultArbeitszeit / this.arbeitszeit.value);
      try {
        if (this.arbeitszeit.value !== null) {
          this.UserService.updateUrlaubstage(this.user?.id, newUrlaubstage);
        }
        this.user.urlaubstage = Math.trunc(newUrlaubstage);
        this.user.arbeitszeit = this.arbeitszeit.value;
      } catch (error) {
        this.SnackBarService.open('Error when updating holiday days');
      }
    } else {
      this.SnackBarService.open('The new holiday days could not be calculated');
    }
  }


  openArbeitszeitModal(user: User): void {
    const dialogRef = this.dialog.open(ArbeitszeitModalComponent, {
      width: '400px',
      data: { user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.arbeitszeit.next(result);
        this.updateArbeitszeit(result);
      }
    });
  }
}
