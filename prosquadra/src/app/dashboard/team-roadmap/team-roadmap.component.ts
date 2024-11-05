import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../types/project';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-team-roadmap',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragPlaceholder],
  templateUrl: './team-roadmap.component.html',
  styleUrls: ['./team-roadmap.component.scss']
})
export class TeamRoadmapComponent implements AfterViewInit{

  projects:Project[]=[];
  selectedProject?: Project;
  protected readonly window = window;

  constructor(private ProjectService: ProjectService) {
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    if (window.innerWidth < 1000) {
      const projectDetailsElement = document.querySelector('.project-details');
      if (projectDetailsElement) {
        projectDetailsElement.scrollIntoView({behavior: 'smooth'});
      }
    }
  }


  // Access projectList from team-roadmap.ts.component.html
  @ViewChild('projectList') projectList!: ElementRef;

  // Block default scroll, enable horizontal scroll
  // Inspired by https://stackoverflow.com/questions/59468926/horizontal-scroll-in-typescript
  onWheelScroll(event: WheelEvent): void {
    if (window.innerWidth > 1000) {
      event.preventDefault();
      this.projectList.nativeElement.scrollLeft += event.deltaY;
    }
  }

  // Lifecycle Hook
  async ngAfterViewInit() {
    try {
      this.projects = await this.ProjectService.getProjects();
    }catch (error){
      console.error('Error while fetching Projects:', error);
    }finally {
      console.log('Project fetching finished.');
    } // hier mit Team holen um individualisiert anzuzeigen


    this.projectList.nativeElement.addEventListener('wheel', this.onWheelScroll.bind(this));


    setTimeout(() => {
      this.selectInitialProject(); // timeout to avoid angular error during lifecycle method
    });
  }

  selectInitialProject(): void {
    if (this.projects && this.projects.length > 0) {
      this.selectProject(this.projects[0]);
    }
  }
  drop(event: CdkDragDrop<Project[]>) {
    if (this.projects) {
      moveItemInArray(this.projects, event.previousIndex, event.currentIndex)
    }
  }


}
