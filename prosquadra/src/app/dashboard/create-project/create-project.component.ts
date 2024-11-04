import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
    private teamService: TeamService
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(10)]], // Correct maxLength usage
      productOwner: ['', Validators.required],
      scrumMaster: ['', Validators.required],
      teamName: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.loadUsers();
    this.loadTeams();
  }

  loadUsers() {
    const users = this.userService.getUsers();
    this.productOwners = users.filter(user => user.role === 'Product Owner');
    this.scrummasters = users.filter(user => user.role === 'Scrum Master');
  }

  loadTeams() {
    this.teams = this.teamService.getTeams();
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const selectedTeam = this.teams.find(team => team.id === this.projectForm.value.teamName); // Get the selected team

      const newProject: Project = {
        backlogItemsDone: 0,
        backlogItemsTotal: 0,
        description: '',
        developers: [],
        effortEstimation: '',
        estimationDays: 0,
        id: 0, // Ensure this is correctly assigned based on your logic
        name: this.projectForm.value.projectName,
        productOwner: this.projectForm.value.productOwner,
        scrumMaster: this.projectForm.value.scrumMaster,
        team: selectedTeam ? { // Ensure this is a valid Team object
          id: selectedTeam.id,
          name: selectedTeam.name,
          members: selectedTeam.members || [] // Make sure to include members if they exist
        } : undefined // or handle the case where no team is selected
      };

      console.log('Form Submitted', newProject);
      this.projectService.setProjects(newProject);
      this.selectedTeam = selectedTeam; // Set the selected team for rendering
      this.projectForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}
