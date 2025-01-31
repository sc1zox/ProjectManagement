import {Component, OnInit, ViewChild} from '@angular/core';
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
import {SnackbarService} from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../types/user';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';
import {RoadmapService} from '../../../services/roadmap.service';

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
    MatOption,
    NgProgressbar,
  ],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit{

  projectForm: FormGroup;
  teams?: Team[];
  userTeam?: Team;
  selectedTeam?: Team; // Variable to hold the selected team
  roadmap?: Roadmap;
  currentTeam?: Team;
  user?: User;
  users: User[] = [];
  bereichsleiter: User[] = []
  @ViewChild(NgProgressRef) progressBar!: NgProgressRef;

  constructor(
    private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly TeamService: TeamService,
    private readonly NotificationService: NotificationsService,
    private readonly SnackBarService: SnackbarService,
    private readonly UserService: UserService,
    private readonly RoadmapService: RoadmapService,
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(15)]], // Correct maxLength usage
      description: ['', [Validators.required, Validators.maxLength(50)]],
      teamName: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.loadTeams();
    if(this.user && this.user.teams) {
      this.userTeam = this.user?.teams[0];
    }
    this.users = await this.UserService.getUsers();
    this.bereichsleiter = this.UserService.getBereichsleiter(this.users);
  }

  async loadTeams() {
    try {
      if(!this.user) {
        this.user = await this.UserService.getCurrentUser();
      }
      this.teams = await this.TeamService.getTeamsByUserId(this.user!.id);
    }catch (error){
      this.SnackBarService.open('Could not load the teams')
    }
  }

  async onSubmit(): Promise<void> {
    let newProject: Project;
    this.progressBar.start();
    if (this.projectForm.valid && this.teams) {
      const selectedTeam = this.teams.find(team => team.id === this.projectForm.value.teamName);
      if (selectedTeam) {
        let existingProjects;
        try {
          existingProjects = await this.projectService.getProjectsByTeamId(selectedTeam.id);
        }catch (error){
          this.SnackBarService.open('Could not load specified project');
          this.progressBar.complete();
          return;
        }

        const maxPriorityPosition = existingProjects!.length > 0
          ? Math.max(...existingProjects?.map(project => project.priorityPosition || 0))
          : 0;
        const newPriorityPosition = maxPriorityPosition + 1;
        newProject = {
          id: 0,
          name: this.projectForm.value.projectName,
          description: this.projectForm.value.description,
          team: selectedTeam,
          projectStatus: ProjectStatus.offen,
          priorityPosition: newPriorityPosition,
        };
        try {
          await this.projectService.setProjects(newProject);
        }catch (error){
          this.SnackBarService.open('Project could not be created');
          this.progressBar.complete();
        }
        this.selectedTeam = selectedTeam;
        try {
          this.currentTeam = await this.TeamService.getTeamById(selectedTeam.id);
          this.roadmap = await this.RoadmapService.getRoadmapById(this.currentTeam.roadmap?.id)
        }catch (error){
          this.SnackBarService.open('Could not load the team')
          this.progressBar.complete();
        }
      }
      if (this.selectedTeam) {
        this.selectedTeam.members?.forEach((member) => {
          this.NotificationService.createNotification(`The project: ${newProject!.name} has been added to your team: ${this.selectedTeam!.name}`, member.id);
        });
        for (let b of this.bereichsleiter){
          await this.NotificationService.createNotification(`The project: ${newProject!.name} was added to the team: ${this.selectedTeam.name}`, b.id)
        }
        this.projectForm.reset();
      } else {
        console.log('Form is invalid');
      }
    }
    this.progressBar.complete();
  }
}
