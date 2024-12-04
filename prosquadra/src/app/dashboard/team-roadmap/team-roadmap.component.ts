import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, Signal,
  SimpleChanges, viewChild,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectService} from '../../../services/project.service';
import {Project, ProjectStatus} from '../../../types/project';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, provideNativeDateAdapter} from '@angular/material/core';
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
import {TimeEstimatorComponent} from '../../components/time-estimator/time-estimator.component';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {Router} from '@angular/router';
import {EndDateComponent} from '../../components/end-date/end-date.component';
import { MatSelect } from '@angular/material/select';
import {SpinnerService} from '../../../services/spinner.service';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';

const isStartDateInRange = (projects: Project[], startDate: Date, selectedProject: Project): boolean => {
  const projectsWithoutItself = projects.filter(project => project.id !== selectedProject.id);
  const projectsMapped = parseProjects(projectsWithoutItself);
  const result = projectsMapped
    .filter(project => (project.startDate !== null && project.endDate !== null))
  const boolresult = result.some(range => startDate >= (range.startDate as Date) && startDate <= (range.endDate as Date)); //as Date to avoid undefined

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
    TimeEstimatorComponent,
    MatSelectModule,
    MatOptionModule,
    EndDateComponent,
    NgProgressbar,
  ],
  providers: [provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}
  ],
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
  countEstimatesByUser: number = 0;
  maxEstimates: number = 0;
  selectedProject?: Project;
  endDateFromBackendForCurrentProject?: Date;
  startDateFromBackendForCurrentProject?: Date;
  private originalStatus: ProjectStatus | null = null;
  @Output() dataUpdated = new EventEmitter<void>();
  @ViewChild(NgProgressRef) progressBar!: NgProgressRef;
  hours?: number;
  days?: number;
  startDateControl = new FormControl();
  dateForm: FormGroup;
  updated: boolean = false;
  @ViewChild('projectList') projectList?: ElementRef;
  protected readonly window = window;
  protected readonly UserRole = UserRole;

  readonly ProjectStatus = ProjectStatus;
  projectStatuses: ProjectStatus[] = Object.values(ProjectStatus);

  showTimeEstimator: boolean = false;
  hideInDashboard: boolean = false;
  notDraggableInDashboardHome: boolean = false;

  private isDragging = false;

  constructor(private readonly ProjectService: ProjectService,
              private readonly UserService: UserService, private readonly fb: FormBuilder,
              private readonly RoadmapService: RoadmapService, private SnackBarSerivce: SnackbarService, private cdr: ChangeDetectorRef, private router: Router,private readonly SpinnerService: SpinnerService) {
    this.dateForm = this.fb.group({
      startDate: this.startDateControl,
    });
    this.startDateControl.setValidators(this.startDateValidator.bind(this));
  }

  startDateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.value;
    if (this.selectedProject !== undefined) {
      if (isStartDateInRange(this.projects, startDate, this.selectedProject) && startDate !== null) {
        this.SnackBarSerivce.open('Das Startdatum darf sich nicht mit einem Projekt überschneiden')
        return {startDateInvalid: true}
      }
    }
    return null;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['roadmap'] && this.roadmap || changes['roadmap.projects']) {
      this.extractProjectsFromRoadmaps();
      this.selectInitialProject();
    }

    if (changes['selectedProject'] && this.selectedProject) {
      this.startDateControl.setValue(this.selectedProject.startDate, {emitEvent: false});
      this.updateDateControls();
    }
  }

  extractProjectsFromRoadmaps() {
    if (this.roadmap) {
      this.projects = this.roadmap.projects;
    }
  }

  async ngOnInit() {
    this.endDateFromBackendForCurrentProject = undefined;
    if (!this.user) {
      this.user = await this.UserService.getCurrentUser();
    }
    if (this.roadmap) {
      this.extractProjectsFromRoadmaps();
      // sort projects after prioposition and if undefined set very high value to put at the end but this should not be able to happen anyway as prio is always set on frontend
      this.roadmap.projects.sort((a, b) => {
        const priorityA = a.priorityPosition ?? Number.MAX_VALUE;
        const priorityB = b.priorityPosition ?? Number.MAX_VALUE;
        return priorityA - priorityB;
      });
    }
    await this.setSelectedProjectAvgEstimation();
    this.selectInitialProject();
    this.updateDateControls();
    this.showTimeEstimator = this.router.url.includes('dashboard/team-roadmap');
    this.hideInDashboard = this.router.url.includes('dashboard/team-roadmap') || this.router.url.includes('dashboard/create-project') || this.canEditInDashboard();
    this.notDraggableInDashboardHome = this.router.url.includes('dashboard/team-roadmap') || this.router.url.includes('dashboard/create-project') || this.canEditInDashboard();
  }

  canEditStatus(): boolean {
    switch (this.user?.role) {
      case UserRole.Admin:
      case UserRole.PO:
      case UserRole.Bereichsleiter:
        return true;
      default:
        return false;
    }
  }

  canEditInDashboard(): boolean {
    switch (this.user?.role) {
      case UserRole.Bereichsleiter:
        return true;
      default:
        return false;
    }
  }

  canEditDate(): boolean {
    switch (this.user?.role) {
      case UserRole.Admin:
      case UserRole.SM:
      case UserRole.Bereichsleiter:
        return true;
      default:
        return false;
    }
  }

  onStatusDropdownOpened(): void {
    if (this.selectedProject) {
      this.originalStatus = this.selectedProject.projectStatus;
    }
  }

  async onStatusChange(event: MatSelectChange, select: MatSelect): Promise<void> {
    const newStatus = event.value as ProjectStatus;

    if(this.countEstimatesByUser !== this.maxEstimates /*&& select.value !== ProjectStatus.geschlossen*/){ //soll schließen hier möglich sein?
     this.SnackBarSerivce.open('Aktualisierung fehlgeschlagen, fehlende Entwickler Schätzungen')
      if (this.selectedProject) {
        select.writeValue(this.originalStatus);
      }
      return;
    }

    if (this.selectedProject) {
      this.selectedProject.projectStatus = newStatus;
      try {
        await this.ProjectService.setProjectStatus(this.selectedProject.id!, newStatus);
      } catch (error) {
        this.SnackBarSerivce.open("Status konnte nicht geupdated werden");
        select.writeValue(this.originalStatus);
        return;
      }
      this.updateDateControls();
    }
  }

  updateDateControls(): void {
    if (!this.selectedProject) return;

    //console.log('Updating Date Controls. Current Status:', this.selectedProject.projectStatus);

    switch (this.selectedProject.projectStatus) {
      case ProjectStatus.geschlossen:
        this.startDateControl.disable({emitEvent: false});
        break;

      case ProjectStatus.inBearbeitung:
        this.startDateControl.enable({emitEvent: false});
        break;

      case ProjectStatus.offen:
        this.startDateControl.disable({emitEvent: false});
        break;

      default:
        console.warn('Unhandled Project Status:', this.selectedProject.projectStatus);
    }
    // Force UI to update
    this.cdr.detectChanges();
  }

  getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.offen:
        return 'Offen';
      case ProjectStatus.inBearbeitung:
        return 'In Bearbeitung';
      case ProjectStatus.geschlossen:
        return 'Geschlossen';
      default:
        return status;
    }
  }

  async setSelectedProjectAvgEstimation() {
    if (this.selectedProject && this.selectedProject.id) {
      try {
        this.selectedProject.avgEstimationHours = await this.ProjectService.getProjectEstimationAvg(this.selectedProject?.id);
      } catch (error) {
        this.SnackBarSerivce.open("Schätzungen konnte nicht abgerufen werden");
      }
    }
  }

  /*
    getUserEstimationForSelectedProject(): number | undefined {
      if (this.selectedProject && this.selectedProject.id) {
        this.currentEstimation = this.userEstimates.find(est => est.projectId === this.selectedProject!.id);
        return this.currentEstimation ? this.currentEstimation.hours : undefined;
      }
      return undefined;
    }

    updateUserEstimation(estimatedTime: Estimation): void {
      this.currentEstimation = estimatedTime;
    }
  */
  async selectProject(project: Project): Promise<void> {
    this.selectedProject = project;

    // Update the form controls to reflect the selected project
    this.startDateControl.setValue(project.startDate, {emitEvent: false});

    // Update control locking state based on the selected project's status
    this.updateDateControls();

    try {
      await this.setSelectedProjectAvgEstimation();
    } catch (error) {
      this.SnackBarSerivce.open('Konnte Schätzung nicht laden');
    }

    if (this.selectedProject && this.selectedProject.estimations) {
      this.countEstimatesByUser = this.selectedProject?.estimations?.length;
    }
    if (this.teams?.members){
      this.maxEstimates = this.teams?.members?.filter(member => member.role === UserRole.Developer).length;
    }

    if (this.selectedProject?.id) {
      try {
        let tmpProjectFromBackend = await this.ProjectService.getProjectsById(this.selectedProject?.id)
        this.endDateFromBackendForCurrentProject = tmpProjectFromBackend.endDate;
        this.startDateFromBackendForCurrentProject = tmpProjectFromBackend.startDate;
      } catch (error) {
        console.log(error)
      }
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = false;

    setTimeout(() => {
      if (event.buttons === 1) {
        this.isDragging = true; // Detect dragging
      }
    }, 100);
  }

  // Handle project clicks
  async handleProjectClick(event: MouseEvent, project: Project): Promise<void> {
    if (this.isDragging) {
      // Ignore clicks if dragging
      return;
    }

    // Use the existing selectProject method
    await this.selectProject(project);
  }

  // Inspired by https://stackoverflow.com/questions/59468926/horizontal-scroll-in-typescript
  onWheelScroll(event: WheelEvent): void {
    if (window.innerWidth > 1000 && this.projectList && !event.defaultPrevented) {
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

  drop(event: CdkDragDrop<Project[]>): void {
    if (this.projects && event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.projects, event.previousIndex, event.currentIndex);

      this.projects.forEach((project, index) => {
        project.priorityPosition = index + 1;
      });

      if (this.roadmap) {
        this.roadmap.projects = this.projects;
      }
      this.updated = true
    }
  }



  async onSubmit() {
    try {
      if (this.roadmap) {
        await this.RoadmapService.updateRoadmap(this.roadmap);
        await this.refreshProjectOrder();
      }
      if (this.user?.role === UserRole.Developer) {
        this.dataUpdated.emit(); // das hier verursacht ein doppeltes rendern der ersten roadmap. Unsicher ob es weggelassen werden kann für andere Updates.Scheint mir momentan nicht essenziell zu sein. Doch wenn es fehlt wird für Dev die Zeit nicht aktualisiert deshalb die if clause
      }
      this.SnackBarSerivce.open('Projekt Priorität wurde erfolgreich geändert')
    } catch (error) {
      this.SnackBarSerivce.open('Bei der Projektpriorisierung ist ein Fehler aufgetreten')
    }
  }


  async onDelete() {
    this.progressBar.start();
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
        this.SnackBarSerivce.open('Fehler beim Löschen des Projekts');
      }finally {
        this.progressBar.complete();
      }
    }
    this.progressBar.complete()
  }

  async refreshProjectOrder() {
    try {
      if (this.roadmap) {
        this.roadmap = await this.RoadmapService.getRoadmapById(this.roadmap.id);
        this.projects = [...this.roadmap.projects];
      }
    } catch (error) {
      this.SnackBarSerivce.open('Fehler bei refetch roadmap')
    }
  }

  async updateTimeEstimate(): Promise<void> {
    if (this.selectedProject?.id) {
      try {
        const updatedEstimation = await this.ProjectService.getProjectEstimationAvg(this.selectedProject.id);
        if (updatedEstimation !== -1) {
          this.selectedProject.avgEstimationHours = updatedEstimation;
        }
      } catch (error) {
        this.SnackBarSerivce.open('Fehler bei fetchen von getProjectEstimationAvg')
      }
    }
  }
}
