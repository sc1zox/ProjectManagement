import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import { Project } from '../../../types/project';
import {User, UserRole} from '../../../types/user';
import { CommonModule } from '@angular/common';
import {Team} from '../../../types/team';
import {SnackbarService} from '../../../services/snackbar.service';
import {FormControl} from '@angular/forms';
import {ProjectService} from '../../../services/project.service';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';

@Component({
  selector: 'app-end-date',
  standalone: true,
  imports: [CommonModule, NgProgressbar],
  templateUrl: './end-date.component.html',
  styleUrl: './end-date.component.scss'
})

export class EndDateComponent implements AfterViewInit{
  @Input() currentTeam?: Team;
  @Input() currentProject?: Project;
  @Input() startDateControl = new FormControl();
  developers?: User[]
  result?: Date;
  @ViewChild(NgProgressRef) progressBar!: NgProgressRef;

  constructor(private readonly SnackBarService: SnackbarService,private readonly ProjectService: ProjectService) {
  }
// if(this.currentProject?.id) {
//       this.projectFromBackend = await this.ProjectService.getProjectsById(this.currentProject?.id);
//       console.log("BACKEND",this.projectFromBackend)
//     }
//     this.result = this.projectFromBackend?.endDate;
  async ngAfterViewInit() {
    this.developers = this.currentTeam?.members?.filter(member => member.role === UserRole.Developer);

    this.startDateControl.valueChanges.subscribe(() => {
      if(this.startDateControl.valid) {
        this.calculateEndDate();
      }
    });
  }

  async calculateEndDate () {
    if (this.startDateControl.invalid) {
      this.SnackBarService.open('Das Startdatum ist ungültig. Bitte korrigieren Sie es, bevor Sie fortfahren.');
      return;
    }
    this.progressBar.start();
    if(this.startDateControl.value && this.currentProject && this.currentProject.avgEstimationHours && this.developers) {
      this.result = this.calculateProjectEndDate(this.startDateControl.value, this.currentProject?.avgEstimationHours, this.developers)
    }
    if(this.result) {
      console.log(this.result)
      let body = {id: this.currentProject?.id,endDate: this.result,startDate:this.startDateControl.value}
      try {
        await this.ProjectService.updateProject(body);
        this.SnackBarService.open('Projektdaten wurden aktualisiert!')
      }catch (error){
        this.SnackBarService.open('Projektdaten konnte nicht aktualisiert werden');
      }finally {
        this.progressBar.complete();
      }
    }
  }

  calculateProjectEndDate(
    startDate: Date,
    estimationHours: number,
    developers: User[]
  ): Date | undefined {
    if (!startDate) {
      this.SnackBarService.open('Es wurde noch kein Startdatum vergeben')
      return;
    }
    if(estimationHours <= 0){
      this.SnackBarService.open('Es wurden noch keine Schätzungen abgegeben');
      return;
    }

    const workingHoursPerDay = 8; // Default daily working hours
    let remainingHours = estimationHours;
    let currentDate = new Date(startDate);

    const isVacationDay = (date: Date, user: User): boolean => {
      if (!user.urlaub) return false;
      return user.urlaub.some(urlaub => {
        const urlaubStart = new Date(urlaub.startDatum);
        const urlaubEnd = new Date(urlaub.endDatum);
        return date >= urlaubStart && date <= urlaubEnd;
      });
    };

    const isWeekend = (date: Date): boolean => {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 6 || dayOfWeek === 0;
    };

    while (remainingHours > 0) {
      let dailyCapacity = 0;

      // Calculate effective daily working capacity by summing up available hours of team members
      for (const member of developers) {
        if (!isVacationDay(currentDate, member) && !isWeekend(currentDate) && member.arbeitszeit) {
          let memberArbeitszeitPercentage = member.arbeitszeit * 0.6;
          dailyCapacity += (memberArbeitszeitPercentage/ 5) || workingHoursPerDay;
        }
      }

      if (dailyCapacity > 0) {
        remainingHours -= dailyCapacity;
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return currentDate;
  }
}
