import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../types/project';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {MatButton} from '@angular/material/button';
import {Roadmap} from '../../../types/roadmap';
import {User, UserRole} from '../../../types/user';
import {RoadmapService} from '../../../services/roadmap.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {Team} from '../../../types/team';
import {parseProjects} from '../../../mapper/projectDatesToDate';
import { TimeEstimatorComponent } from '../../components/time-estimator/time-estimator.component';

const isStartDateInRange = (projects: Project[], startDate: Date): boolean => {
  const projectsMapped = parseProjects(projects);
  const result = projectsMapped
    .filter(project => (project.startDate !== null && project.endDate !== null))
  const boolresult = result.some(range => startDate >= (range.startDate as Date) && startDate <= (range.endDate as Date));

  return boolresult;
};


@Component({
  selector: 'app-team-roadmap',
  standalone: true,
  imports: [CommonModule,
    CdkDropList,
    CdkDrag,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule, 
    MatButton,
    TimeEstimatorComponent],
  templateUrl: './team-roadmap.component.html',
  styleUrls: ['./team-roadmap.component.scss']
})
export class TeamRoadmapComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() roadmap?: Roadmap;
  @Input() user?: User;
  @Input() teams?: Team;
  @Input() estimatableDEV: boolean = false;
  @Input() setTimeScrum: boolean = false;
  @Input() enableDragDrop: boolean = false;

  projects: Project[] = [];
  selectedProject?: Project;
  teamname: string = ''; // get Team name to display
  @Output() dataUpdated = new EventEmitter<void>()
  hours?: number;
  days?: number;
  startDateControl = new FormControl();
  endDateControl = new FormControl();
  dateForm: FormGroup;
  @ViewChild('projectList') projectList?: ElementRef;
  protected readonly window = window;
  protected readonly UserRole = UserRole;

  constructor(private readonly ProjectService: ProjectService,
              private readonly UserService: UserService, private readonly fb: FormBuilder,
              private readonly RoadmapService: RoadmapService, private SnackBarSerivce: SnackbarService) {
    this.dateForm = this.fb.group({
      startDate: this.startDateControl,
      endDate: this.endDateControl,
    });
    this.startDateControl.setValidators(this.startDateValidator.bind(this));
    this.endDateControl.setValidators(this.endDateValidator.bind(this));
  }

  startDateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.value;
    console.log(this.projects);
    if (isStartDateInRange(this.projects, startDate) && startDate !== null) {
      this.SnackBarSerivce.open('Das Startdatum darf sich nicht mit einem Projekt überschneiden')
      return {startDateInvalid: true}
    }
    return null;
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
    if (!this.user) {
      this.user = await this.UserService.getCurrentUser();
    }
    if (this.roadmap) {
      this.extractProjectsFromRoadmaps();
      // sort projects after prioposition and if undefined set very high value to put at the end but this should not be able to happen anyway as prio is always set on frontend
      this.roadmap.projects.sort((a, b) => {
        const priorityA = a.PriorityPosition ?? Number.MAX_VALUE;
        const priorityB = b.PriorityPosition ?? Number.MAX_VALUE;
        return priorityA - priorityB;
      });
    }
    this.selectInitialProject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roadmap'] && this.roadmap || changes['roadmap.projects']) {
      console.log('Received updated roadmap:', this.roadmap);
      this.extractProjectsFromRoadmaps();
      this.selectInitialProject();
    }
  }

  extractProjectsFromRoadmaps() {
    if (this.roadmap) {
      this.projects = this.roadmap.projects;
    }
  }

  // Block default scroll, enable horizontal scroll

  selectProject(project: Project): void {
    this.selectedProject = project;

    this.startDateControl.setValue(project.startDate);
    this.endDateControl.setValue(project.endDate);
  }

  // Inspired by https://stackoverflow.com/questions/59468926/horizontal-scroll-in-typescript
  onWheelScroll(event: WheelEvent): void {
    if (window.innerWidth > 1000 && this.projectList) {
      event.preventDefault();
      this.projectList.nativeElement.scrollLeft += event.deltaY;
    }
  }

  // Lifecycle Hook
  async ngAfterViewInit() {
    if (this.projectList)
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
    if (this.days === 0 && this.hours === 0 && this.user?.role === UserRole.Developer) {
      this.SnackBarSerivce.open("Die Dauer darf nicht 0 Stunden und 0 Tage sein")
      return;
    }
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
        this.hours = 0;
        this.days = 0;
        if (this.user?.role === UserRole.Developer) {
          this.dataUpdated.emit(); // das hier verursacht ein doppeltes rendern der ersten roadmap. Unsicher ob es weggelassen werden kann für andere Updates.Scheint mir momentan nicht essenziell zu sein. Doch wenn es fehlt wird für Dev die Zeit nicht aktualisiert deshalb die if clause
        }
        this.SnackBarSerivce.open('Projekt wurde erfolgreich erstellt')
      } catch (error) {
        console.error('Error updating project roadmap:', error);
        this.SnackBarSerivce.open('Bei der Projekterstellung ist ein Fehler aufgetreten')
      }
    }
  }

  async onDelete() {
    if (this.roadmap?.projects && !(this.roadmap?.projects.length > 1)) {
      this.SnackBarSerivce.open('Löschen fehlgeschlagen! Die Roadmap enthält nur ein Projekt')
      return;
    }
    if (this.selectedProject?.id) {
      try {
        await this.ProjectService.deleteProjectById(this.selectedProject.id);
        this.projects = this.projects.filter(project => project.id !== this.selectedProject?.id);

        if (this.roadmap) {
          this.roadmap.projects = [...this.projects];
        }

        this.selectedProject = undefined;

        this.dataUpdated.emit();

        this.SnackBarSerivce.open('Projekt erfolgreich gelöscht');
      } catch (error) {
        console.error('Error deleting project:', error);
        this.SnackBarSerivce.open('Fehler beim Löschen des Projekts');
      }
    }
  }

  async refreshProjectOrder() {
    if (this.roadmap) {
      this.roadmap = await this.RoadmapService.getRoadmapById(this.roadmap.id);
      this.projects = [...this.roadmap.projects];
    }
  }
}
