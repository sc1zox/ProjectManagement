import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {Project} from '../../../types/project';
import {SnackbarService} from '../../../services/snackbar.service';
import {UserService} from '../../../services/user.service';
import {User} from '../../../types/user';
import {ProjectService} from '../../../services/project.service';
import {Estimation} from '../../../types/estimation';



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

export class TimeEstimatorComponent implements OnInit{
  timeEstimateForm: FormGroup;
  result: number | null = null;
  currentUser?: User;
  @Input() currentProject?: Project;
  @Output() myTimeEstimate = new EventEmitter<Estimation>();


  timeUnits = [
    {value: 'hours', label: 'Hours'},
    {value: 'days', label: 'Days'},
  ];

  estimateFields = [
    {label: 'Optimistic', control: 'optimistic', unitControl: 'optimisticUnit'},
    {label: 'Realistic', control: 'realistic', unitControl: 'realisticUnit'},
    {label: 'Pessimistic', control: 'pessimistic', unitControl: 'pessimisticUnit'},
  ];

  constructor(private fb: FormBuilder, private ProjectService: ProjectService,private UserService: UserService,private readonly SnackBarService: SnackbarService) {
    this.timeEstimateForm = this.fb.group({
      optimistic: [null, Validators.required],
      optimisticUnit: ['hours', Validators.required],
      realistic: [null, Validators.required],
      realisticUnit: ['hours', Validators.required],
      pessimistic: [null, Validators.required],
      pessimisticUnit: ['hours', Validators.required],
    });
  }

  async ngOnInit(){
    this.currentUser = await this.UserService.getCurrentUser();
  }

  async calculateEstimate(): Promise<void> {
    const formValues = this.timeEstimateForm.value;

    // Convert all estimates to hours
    const optimistic = this.convertToHours(formValues.optimistic, formValues.optimisticUnit);
    const realistic = this.convertToHours(formValues.realistic, formValues.realisticUnit);
    const pessimistic = this.convertToHours(formValues.pessimistic, formValues.pessimisticUnit);

    // PERT formula
    this.result = Math.round((optimistic + 4 * realistic + pessimistic) / 6);
    try {
      if (this.currentProject && this.currentUser && this.currentProject.id) {
       const response =  await this.ProjectService.updateEstimation(this.result, this.currentUser.id, this.currentProject.id)
        console.log('ApiResponse:',response);
       this.myTimeEstimate.emit(response);
      }
    }catch (error){
      this.SnackBarService.open("Einschätzung konnte nicht geladen werden");
    }
  }

  private convertToHours(value: number, unit: string): number {
    return unit === 'days' ? value * 24 : value;
  }
}
