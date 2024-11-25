import {AfterViewInit, Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {TeamRoadmapComponent} from '../team-roadmap/team-roadmap.component';
import {ProjectService} from '../../../services/project.service';
import {TeamService} from '../../../services/team.service';
import {Project, ProjectStatus} from '../../../types/project';
import {Team} from '../../../types/team';
import {Roadmap} from '../../../types/roadmap';
import {NotificationsService} from '../../../services/notifications.service';

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
  roadmap?: Roadmap;
  currentTeam?: Team;
  position: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
    private readonly TeamService: TeamService,
    private readonly NotificationService: NotificationsService,
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(10)]], // Correct maxLength usage
      description: ['', Validators.required],
      teamName: ['', Validators.required],
    });
  }

  async ngAfterViewInit() {
    await this.loadTeams();
  }

  async loadTeams() {
    this.teams = await this.teamService.getTeams();
  }

  async onSubmit(): Promise<void> {
    if (this.projectForm.valid) {
      const selectedTeam = this.teams.find(team => team.id === this.projectForm.value.teamName);
      if (selectedTeam) {
        const existingProjects = await this.projectService.getProjectsByTeamId(selectedTeam.id);

        const maxPriorityPosition = existingProjects.length > 0
          ? Math.max(...existingProjects.map(project => project.priorityPosition || 0))
          : 0;
        const newPriorityPosition = maxPriorityPosition + 1;

        const newProject: Project = {
          id: 0,
          name: this.projectForm.value.projectName,
          description: this.projectForm.value.description,
          team: selectedTeam,
          projectStatus: ProjectStatus.offen,
          priorityPosition: newPriorityPosition,
        };
        await this.projectService.setProjects(newProject);
        this.selectedTeam = selectedTeam;
        if (selectedTeam) {
          this.currentTeam = await this.TeamService.getTeamByID(selectedTeam.id);
          this.roadmap = this.currentTeam?.roadmap;

          if (this.roadmap) {
            this.roadmap = {
              ...this.roadmap,
              projects: [
                ...this.roadmap.projects,
                newProject,
              ].sort((a, b) => (a.priorityPosition ?? 0) - (b.priorityPosition ?? 0)) //chatgpt, sortiere hier nach priority
            };
          }
        }
        this.selectedTeam.members?.forEach((member) => {
          this.NotificationService.createNotification('Deinem Team wurde ein Projekt hinzugefügt', member.id);
        });
        this.projectForm.reset();
      } else {
        console.log('Form is invalid');
      }
    }
  }

}
