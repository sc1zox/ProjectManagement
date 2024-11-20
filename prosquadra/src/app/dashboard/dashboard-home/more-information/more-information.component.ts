import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../../services/project.service';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-more-information',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatIconButton
  ],
  templateUrl: './more-information.component.html',
  styleUrls: ['./more-information.component.scss'],
})
export class MoreInformationComponent implements OnInit {
  public InformationContent: string = "";

  constructor(private projectService: ProjectService) {

  }

  ngOnInit(): void {
    // wird später von der api kommen und dem projekt angehören oder so

  }
}
