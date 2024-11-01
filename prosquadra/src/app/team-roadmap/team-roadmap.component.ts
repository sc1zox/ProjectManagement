import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Just string for now, need to change once DB exists
interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  effortEstimation: string;
  description: string;
}

@Component({
  selector: 'app-team-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-roadmap.component.html',
  styleUrls: ['./team-roadmap.component.scss']
})
export class TeamRoadmapComponent {
  projects: Project[] = [
    { id: 1, name: 'A', startDate: '2022-01-01', endDate: '2022-06-30', effortEstimation: 'High', description: 'Project A description.' },
    { id: 2, name: 'B', startDate: '2022-02-01', endDate: '2022-07-30', effortEstimation: 'Medium', description: 'Project B description.' },
    { id: 3, name: 'C', startDate: '2022-03-01', endDate: '2022-08-30', effortEstimation: 'Low', description: 'Project C description.' },
    { id: 4, name: 'D', startDate: '2022-04-01', endDate: '2022-09-30', effortEstimation: 'Medium', description: 'Project D description.' },
    { id: 5, name: 'E', startDate: '2022-04-01', endDate: '2022-09-30', effortEstimation: 'ULTRA', description: 'Project D description.' },
  ];

  selectedProject: Project | null = null;

  selectProject(project: Project): void {
    this.selectedProject = project;
  }

  // Access projectList from team-roadmap.component.html
  @ViewChild('projectList') projectList!: ElementRef;

  // Block default scroll, enable horizontal scroll
  // Inspired by https://stackoverflow.com/questions/59468926/horizontal-scroll-in-typescript
  onWheelScroll(event: WheelEvent): void {
    event.preventDefault();
    this.projectList.nativeElement.scrollLeft += event.deltaY;
  }

  // Lifecycle Hook
  ngAfterViewInit(): void {
    this.projectList.nativeElement.addEventListener('wheel', this.onWheelScroll.bind(this));
  }
}
