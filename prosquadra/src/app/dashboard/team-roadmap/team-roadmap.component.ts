import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../types/project';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import {MatButton, MatIconButton} from '@angular/material/button';


@Component({
  selector: 'app-team-roadmap',
  standalone: true,
  imports: [CommonModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule, MatIconButton, MatButton],
  templateUrl: './team-roadmap.component.html',
  styleUrls: ['./team-roadmap.component.scss']
})
export class TeamRoadmapComponent implements AfterViewInit,OnInit{

  projects:Project[]=[];
  selectedProject?: Project;
  protected readonly window = window;
  isScrumMaster = false;

  startDateControl = new FormControl();
  endDateControl = new FormControl();

  dateForm: FormGroup;

  constructor(private readonly ProjectService: ProjectService,
    private readonly UserService: UserService, private readonly fb: FormBuilder) {
      this.dateForm = this.fb.group({
        startDate: this.startDateControl,
        endDate: this.endDateControl,
      });

      this.endDateControl.setValidators(this.endDateValidator.bind(this));
  }

  endDateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = this.startDateControl.value;
    const endDate = control.value;

    if (startDate && endDate && endDate < startDate) {
      return { endDateInvalid: true }
    }
    return null;
  }

  async ngOnInit() {
    const user = await this.UserService.getCurrentUser();
    if (user && user.role === 'SM') {
      this.isScrumMaster = true;
    } else {
      this.isScrumMaster = false;
    }

    this.loadProjects();
    // Listen to projectCreated$ event
    this.ProjectService.projectCreated$.subscribe(() => {
      this.loadProjects();
    })
  }

  async loadProjects() {
    this.projects = await this.ProjectService.getProjects(); //hier sollten alle von dem aktuellen Team kommen.
  }

  selectProject(project: Project): void {
    this.selectedProject = project;

    this.startDateControl.setValue(project.startDate);
    this.endDateControl.setValue(project.endDate);

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
      console.log("project fetch started")
      this.projects = await this.ProjectService.getProjects();
      console.log(this.projects);
    }catch (error){
      console.error('Error while fetching Projects:', error);
    }finally {
      console.log('Project fetching finished.');
    }


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

  async onSubmit() {
    if (this.selectedProject) {
      const updatedProject = {
        ...this.selectedProject,
        startDate: this.startDateControl.value,
        endDate: this.endDateControl.value,
      };

      try {
        await this.ProjectService.updateProject(updatedProject);
      } catch (error) {
        console.error('Error updating project roadmap:', error);
      }
    }
  }



}
