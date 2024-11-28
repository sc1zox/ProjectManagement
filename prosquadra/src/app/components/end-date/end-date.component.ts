import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';
import { Project } from '../../../types/project';
import { User } from '../../../types/user';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../../services/team.service';
import { TeamsFormComponent } from '../../dashboard/admin-panel/teams-form/teams-form.component';

@Component({
  selector: 'app-end-date',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './end-date.component.html',
  styleUrl: './end-date.component.scss'
})
export class EndDateComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private teamService: TeamService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.projects = await this.projectService.getProjects();
      await this.preCalc();
    } catch (error) {
      console.error(error);
    }
  }

  async preCalc() {

  }

  calculateProjectEndDate(
    startDate: Date,
    estimationHours: number,
    teamMembers: User[]
  ): Date {
    if (!startDate || estimationHours <= 0) {
      throw new Error("Invalid start date or estimation hours");
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
  
    while (remainingHours > 0) {
      let dailyCapacity = 0;
  
      // Calculate effective daily working capacity by summing up available hours of team members
      for (const member of teamMembers) {
        if (!isVacationDay(currentDate, member)) {
          dailyCapacity += member.arbeitszeit || workingHoursPerDay;
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
