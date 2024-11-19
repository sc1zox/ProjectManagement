import {Injectable} from '@angular/core';
import {SnackbarComponent} from '../app/components/snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  open(message: string,) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {message},
    }).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }
}
