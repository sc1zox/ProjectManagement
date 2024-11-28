import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';
import { Project } from '../../../types/project';
import { User } from '../../../types/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-end-date',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './end-date.component.html',
  styleUrl: './end-date.component.scss'
})
export class EndDateComponent implements OnInit {
  projects: Project[] = [];
  errorMessage: string | null = null;

  constructor(
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.projects = await this.projectService.getProjects();
      await this.calculateEndDates();
    } catch (error) {
      this.errorMessage = 'Failed to load projects.';
      console.error(error);
    }
  }

  async calculateEndDates(): Promise<void> {
    for (const project of this.projects) {
      if (!project.startDate) continue;

      const teamUsers = project.team?.members || [];
      if (teamUsers.length === 0) {
        console.warn(`Project "${project.name}" has no team members.`);
        continue;
      }

      const estimationHours = await this.projectService.getProjectEstimationAvg(
        project.id!
      );

      if (estimationHours === -1) {
        console.warn(`Project "${project.name}" has no valid estimation.`);
        continue;
      }

      const fullUsersData = await Promise.all(
        teamUsers.map(user => this.userService.getUser(user.id))
      );

      const calculatedEndDate = this.calculateEndDatumForProject(
        new Date(project.startDate),
        estimationHours,
        fullUsersData
      );

      project.endDate = calculatedEndDate;
    }
  }

  calculateEndDatumForProject(
    startDatum: Date,
    estimationHours: number,
    users: User[]
  ): Date {
    const workingHoursPerDay = 8; // Needs to change
    const userWorkingHours = users.map(user => user.arbeitszeit || workingHoursPerDay);
    const totalDailyCapacity = userWorkingHours.reduce((sum, hours) => sum + hours, 0);
  
    let remainingHours = estimationHours;
    let currentDate = new Date(startDatum);
  
    const getLostHoursForDate = (date: Date): number => {
      let lostHours = 0;
      for (const user of users) {
        if (user.urlaub) {
          for (const urlaub of user.urlaub) {
            const urlaubStart = new Date(urlaub.startDatum);
            const urlaubEnd = new Date(urlaub.endDatum);
            if (date >= urlaubStart && date <= urlaubEnd) {
              lostHours += user.arbeitszeit || workingHoursPerDay; // Add lost hours
            }
          }
        }
      }
      return lostHours;
    };
  
    while (remainingHours > 0) {
      const lostHours = getLostHoursForDate(currentDate);
      const effectiveCapacity = totalDailyCapacity - lostHours;
  
      if (effectiveCapacity > 0) {
        remainingHours -= effectiveCapacity;
      }
  
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return currentDate;
  }  
}
