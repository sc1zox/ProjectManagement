import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UpdateService } from '../../../services/update.service';


@Component({
  selector: 'app-time-estimator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './time-estimator.component.html',
  styleUrls: ['./time-estimator.component.scss'],
})

export class TimeEstimatorComponent {
  timeEstimateForm: FormGroup;
  result: number | null = null;

  timeUnits = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
  ];

  estimateFields = [
    { label: 'Optimistic', control: 'optimistic', unitControl: 'optimisticUnit' },
    { label: 'Realistic', control: 'realistic', unitControl: 'realisticUnit' },
    { label: 'Pessimistic', control: 'pessimistic', unitControl: 'pessimisticUnit' },
  ];

  constructor(private fb: FormBuilder, private service: UpdateService) {
    this.timeEstimateForm = this.fb.group({
      optimistic: [null, Validators.required],
      optimisticUnit: ['hours', Validators.required],
      realistic: [null, Validators.required],
      realisticUnit: ['hours', Validators.required],
      pessimistic: [null, Validators.required],
      pessimisticUnit: ['hours', Validators.required],
    });
  }

  calculateEstimate(): void {
    const formValues = this.timeEstimateForm.value;

    // Convert all estimates to hours
    const optimistic = this.convertToHours(formValues.optimistic, formValues.optimisticUnit);
    const realistic = this.convertToHours(formValues.realistic, formValues.realisticUnit);
    const pessimistic = this.convertToHours(formValues.pessimistic, formValues.pessimisticUnit);

    // PERT formula
    this.result = Math.round((optimistic + 4 * realistic + pessimistic) / 6);
  
    this.service.updateResource("/api/project/update", this.result);
  }

  private convertToHours(value: number, unit: string): number {
    return unit === 'days' ? value * 24 : value;
  }
}
