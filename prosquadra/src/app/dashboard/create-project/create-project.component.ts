import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatOption } from '@angular/material/select';
import { TeamRoadmapComponent } from '../team-roadmap/team-roadmap.component';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';
import { TeamService } from '../../../services/team.service';
import { Project } from '../../../types/project';
import { User } from '../../../types/user';
import { Team } from '../../../types/team';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TeamRoadmapComponent,
    MatSelect,
    MatOption
  ],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements AfterViewInit {

  projectForm: FormGroup;
  scrummasters: User[] = [];
  productOwners: User[] = [];
  teams: Team[] = [];
  selectedTeam?: Team; // Variable to hold the selected team

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private teamService: TeamService,
    private cdref: ChangeDetectorRef
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(10)]], // Correct maxLength usage
      description: ['', Validators.required],
      productOwner: ['', Validators.required],
      scrumMaster: ['', Validators.required],
      teamName: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.loadUsers();
    this.loadTeams();
    this.cdref.detectChanges();
  }

  async loadUsers() {
    const users = await this.userService.getUsers();
    this.productOwners = users.filter(user => user.role === 'PO');
    this.scrummasters = users.filter(user => user.role === 'SM');
  }

  loadTeams() {
    this.teams = this.teamService.getTeams();
  }

  async onSubmit(): Promise<void> {
    if (this.projectForm.valid) {
      const selectedTeam = this.teams.find(team => team.id === this.projectForm.value.teamName);

      const newProject: Project = {
        id: 0, // Ensure to handle ID assignment correctly
        name: this.projectForm.value.projectName,
        description: this.projectForm.value.description,
        team: selectedTeam, // Pass the selected team object
        effortEstimation: '',
        estimationDays: 0
      };

      // Modified to refresh Team-Roadmap Component after submission.
      await this.projectService.setProjects(newProject);
      console.log('Form Submitted', newProject);
      this.selectedTeam = selectedTeam; // Update selected team
      this.cdref.detectChanges(); // Optional, if necessary
      this.projectForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}

