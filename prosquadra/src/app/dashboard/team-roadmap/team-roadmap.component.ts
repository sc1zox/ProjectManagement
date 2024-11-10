import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../types/project';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Roadmap} from '../../../types/roadmap';
import {User, UserRole} from '../../../types/user';
import {RoadmapService} from '../../../services/roadmap.service';


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
export class TeamRoadmapComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() roadmap?: Roadmap;
  @Input() user?: User;
  projects: Project[] = [];
  selectedProject?: Project;
  protected readonly window = window;
  isScrumMaster = false;
  @Output() dataUpdated = new EventEmitter<void>()
  hours?: number;
  days?: number;

  startDateControl = new FormControl();
  endDateControl = new FormControl();

  dateForm: FormGroup;

  constructor(private readonly ProjectService: ProjectService,
              private readonly UserService: UserService, private readonly fb: FormBuilder,
              private readonly RoadmapService: RoadmapService, private cdr: ChangeDetectorRef) {
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
      return {endDateInvalid: true}
    }
    return null;
  }

  async ngOnInit() {
    if (this.user && this.user.role === 'SM') {
      this.isScrumMaster = true;
    } else {
      this.isScrumMaster = false;
    }
    if (!this.user) {
      this.user = await this.UserService.getCurrentUser();
    }
    if (this.roadmap) {
      this.extractProjectsFromRoadmaps();
      // sort projects after prioposition and if undefined set very high value to put at the end but this should not be able to happen anyway as prio is set on frontend
      this.roadmap.projects.sort((a, b) => {
        const priorityA = a.PriorityPosition ?? Number.MAX_VALUE;
        const priorityB = b.PriorityPosition ?? Number.MAX_VALUE;
        return priorityA - priorityB;
      });
    }
    this.selectInitialProject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roadmap'] && this.roadmap) {
      console.log('Received updated roadmap:', this.roadmap);
      this.extractProjectsFromRoadmaps();
      this.selectInitialProject();
    }
    console.log("Aktueller User", this.user)
  }

  extractProjectsFromRoadmaps() {
    if (this.roadmap) {
      this.projects = this.roadmap.projects;
    }
  }

  selectProject(project: Project): void {
    this.selectedProject = project;

    this.startDateControl.setValue(project.startDate);
    this.endDateControl.setValue(project.endDate);
  }


  // Access projectList from team-roadmap.ts.component.html
  @ViewChild('projectList') projectList!: ElementRef;

  // Block default scroll, enable horizontal scroll
  // Inspired by https://stackoverflow.com/questions/59468926/horizontal-scroll-in-typescript
  onWheelScroll(event: WheelEvent): void {
    if (window.innerWidth > 1000 && this.projectList) {
      event.preventDefault();
      this.projectList.nativeElement.scrollLeft += event.deltaY;
    }
  }

  // Lifecycle Hook
  async ngAfterViewInit() {
    this.projectList.nativeElement.addEventListener('wheel', this.onWheelScroll.bind(this));
  }

  selectInitialProject(): void {
    if (this.projects && this.projects.length > 0) {
      this.selectProject(this.projects[0]);
    }
  }

  drop(event: CdkDragDrop<Project[]>) {
    if (this.projects) {
      moveItemInArray(this.projects, event.previousIndex, event.currentIndex)

      this.projects.forEach((project, index) => {
        project.PriorityPosition = index + 1;
      });

      if (this.roadmap) {
        this.roadmap.projects = [...this.projects];
      }
    }
  }

  async onSubmit() {
    if (this.selectedProject) {
      const updatedProject = {
        ...this.selectedProject,
        startDate: this.startDateControl.value,
        endDate: this.endDateControl.value,
        estimationDays: this.days,
        estimationHours: this.hours,
      };

      try {
        await this.ProjectService.updateProject(updatedProject);
        if (this.roadmap) {
          await this.RoadmapService.updateRoadmap(this.roadmap);
          await this.refreshProjectOrder();
        }

        this.dataUpdated.emit();
      } catch (error) {
        console.error('Error updating project roadmap:', error);
      }
    }
  }

  async refreshProjectOrder() {
    if (this.roadmap) {
      this.roadmap = await this.RoadmapService.getRoadmapById(this.roadmap.id);
      this.projects = [...this.roadmap.projects];
    }
  }

  protected readonly UserRole = UserRole;
}
