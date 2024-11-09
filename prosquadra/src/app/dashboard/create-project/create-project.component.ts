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
  teams: Team[] = [];
  selectedTeam?: Team; // Variable to hold the selected team

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private teamService: TeamService,
    private cdref: ChangeDetectorRef
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(10)]], // Correct maxLength usage
      description: ['', Validators.required],
      teamName: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.loadTeams();
    this.cdref.detectChanges();
  }

  async loadTeams() {
    this.teams = await this.teamService.getTeams();
  }

  async onSubmit(): Promise<void> {
    if (this.projectForm.valid) {
      const selectedTeam = this.teams.find(team => team.id === this.projectForm.value.teamName);

      const newProject: Project = {
        id: 0,
        name: this.projectForm.value.projectName,
        description: this.projectForm.value.description,
        team: selectedTeam,
        estimationDays: 0
      };

      // Modified to refresh Team-Roadmap Component after submission.
      await this.projectService.setProjects(newProject);
      console.log('Form Submitted', newProject);
      this.selectedTeam = selectedTeam;
      this.cdref.detectChanges();
      this.projectForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}

