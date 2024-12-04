import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { User } from '../../../../../types/user';
import { MatInput } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-arbeitszeit-modal',
  templateUrl: './arbeitszeit-modal.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton
  ],
  styleUrls: ['./arbeitszeit-modal.component.scss']
})
export class ArbeitszeitModalComponent {
  arbeitszeit: number;

  constructor(
    public dialogRef: MatDialogRef<ArbeitszeitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.arbeitszeit = data.user?.arbeitszeit || 38.5;
  }

  onSave(): void {
    this.dialogRef.close(this.arbeitszeit);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
