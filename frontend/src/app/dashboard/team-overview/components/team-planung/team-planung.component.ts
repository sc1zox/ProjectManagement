import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../types/user';
import {NgForOf} from '@angular/common';
import {TeamService} from '../../../../../services/team.service';
import {Team} from '../../../../../types/team';
import {SnackbarService} from '../../../../../services/snackbar.service';

@Component({
  selector: 'app-team-planung',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './team-planung.component.html',
  styleUrl: './team-planung.component.scss'
})
export class TeamPlanungComponent implements OnInit {
  teams: Team[] = [];
  @Input() user?: User;

  constructor(private readonly TeamService: TeamService,private readonly SnackBarService: SnackbarService) {
  }


  async ngOnInit() {
// überlegung user object mit teams direkt als input zu geben?
    if (this.user) {
      try {
        this.teams = await this.TeamService.getTeamsByUserId(this.user.id)
      }catch (error){
        this.SnackBarService.open("Could not load the user's team")
      }
    }
  }
}
