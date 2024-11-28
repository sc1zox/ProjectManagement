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
      //await this.preCalc(1);
    } catch (error) {
      console.error(error);
    }
  }

  /* 
  Needs major work, way too many fetches. Crashes the entire Browser window 
  async preCalc(projectId: number): Promise<Date> {

    try {
      const project = await this.projectService.getProjectsById(projectId);
      console.log('project', project)
      if (!project.startDate) {
        throw new Error('Project does not have a valid start date');
      }

      const estimationHours = await this.projectService.getProjectEstimationAvg(projectId);
      console.log('eta', estimationHours)

      const team = await this.teamService.getTeamById(project.teamid!);
      console.log('team', team)

      const teamMembers: User[] = team.members
        ? await Promise.all(team.members.map(member => this.userService.getUser(member.id)))
        : [];

      const endDate = this.calculateProjectEndDate(
        new Date(project.startDate),
        estimationHours,
        teamMembers
      )

      return endDate;
    } catch (error) {
      console.log('fuck', error)
      throw error;
    }
  }
    */

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
