import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
  private snackBarRef: MatSnackBarRef<SnackbarComponent>) {}

  close() {
    this.snackBarRef.dismiss();
  }
}
