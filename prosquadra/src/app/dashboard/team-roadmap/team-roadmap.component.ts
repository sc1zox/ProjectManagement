import {
  AfterViewInit,
  ChangeDetectorRef,
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
import {normalizeDate} from '../../../mapper/projectDatesToDate';
import {TimeEstimatorComponent} from '../../components/time-estimator/time-estimator.component';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {Router} from '@angular/router';
import {EndDateComponent} from '../../components/end-date/end-date.component';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';
import {debounceTime} from 'rxjs';
import {canEditDate, canEditInDashboard, canEditStatus} from '../../../permissions/permissionHandler';
import {getStatusLabel} from '../../../helper/roadmapHelper';
import {MatTooltip} from '@angular/material/tooltip';
import {
  getProjectClasses,
  handleDisabledStatus,
  handleDisabledTooltip,
  isProjectEstimated,
  isProjectEstimatedAndNotInPlanningOrClosed,
  isStartDateInRange,
  setOverdueClassIcon,
  setOverdueClassName
} from '../../../helper/projectHelper';
import {MatIcon} from '@angular/material/icon';

const today = normalizeDate(new Date());

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
    NgProgressbar, MatTooltip, MatIcon,
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
  errorWarningProjectOverdue: string = ''
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
  protected readonly getStatusLabel = getStatusLabel;
  protected readonly canEditStatus = canEditStatus;
  protected readonly canEditDate = canEditDate;
  protected readonly getProjectClasses = getProjectClasses;
  protected readonly handleDisabledTooltip = handleDisabledTooltip;
  protected readonly handleDisabledStatus = handleDisabledStatus;
  protected readonly setOverdueClassIcon = setOverdueClassIcon;
  protected readonly setOverdueClassName = setOverdueClassName;


  readonly ProjectStatus = ProjectStatus;
  projectStatuses: ProjectStatus[] = Object.values(ProjectStatus);

  showTimeEstimator: boolean = false;
  hideInDashboard: boolean = false;
  notDraggableInDashboardHome: boolean = false;

  private isDragging = false;

  constructor(private readonly ProjectService: ProjectService,
              private readonly UserService: UserService,
              private readonly fb: FormBuilder,
              private readonly RoadmapService: RoadmapService,
              private SnackBarService: SnackbarService,
              private cdr: ChangeDetectorRef,
              private router: Router,
              ) {
    this.dateForm = this.fb.group({
      startDate: this.startDateControl,
    });
    this.startDateControl.setValidators(this.startDateValidator.bind(this));
  }

  startDateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.value;
    if (this.selectedProject !== undefined) {
      if (isStartDateInRange(this.projects, startDate, this.selectedProject) && startDate !== null) {
        this.SnackBarService.open('The start date must not overlap with a project');

        // Immediately reset the control value | emitEvent: false so calculateEndDate does not get called
        control.setValue(this.selectedProject?.startDate || null, {emitEvent: false});

        // Mark the control as touched to prevent user confusion
        control.markAsTouched();

        return {startDateInvalid: true};
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
      this.updateProjectStatusOnDate();
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
    this.updateProjectStatusOnEstimates();
    this.showTimeEstimator = this.router.url.includes('dashboard/team-roadmap');
    if (this.user) {
      this.hideInDashboard = this.router.url.includes('dashboard/team-roadmap') || this.router.url.includes('dashboard/create-project') || canEditInDashboard(this.user);
      this.notDraggableInDashboardHome = this.router.url.includes('dashboard/team-roadmap') || this.router.url.includes('dashboard/create-project') || canEditInDashboard(this.user);
    }
    this.startDateControl.valueChanges.pipe(debounceTime(300)).subscribe(async (startDate) => {
      if (startDate && this.selectedProject) {
        // Update the selected project's start date
        this.selectedProject.startDate = startDate;

        await this.refreshDates();
      }
    });
  }

  async onStatusChange(event: MatSelectChange): Promise<void> {
    const newStatus = event.value as ProjectStatus;

    if (this.countEstimatesByUser !== this.maxEstimates /*&& select.value !== ProjectStatus.geschlossen*/) { //soll schließen hier möglich sein?
      this.SnackBarService.open('Update failed, missing developer estimates')
      return;
    }
    if (this.selectedProject) {
      this.selectedProject.projectStatus = newStatus;
      try {
        await this.ProjectService.setProjectStatus(this.selectedProject.id!, newStatus);
      } catch (error) {
        this.SnackBarService.open("Status could not be updated");
        return;
      }
      this.updateDateControls();
    }
  }

  updateDateControls(): void {
    if (!this.selectedProject) {
      return;
    }

    switch (this.selectedProject.projectStatus) {
      case ProjectStatus.geschlossen:
        this.startDateControl.disable({emitEvent: false});
        break;

      case ProjectStatus.inPlanung:
        this.startDateControl.enable({emitEvent: false});
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

  async setSelectedProjectAvgEstimation() {
    if (this.selectedProject && this.selectedProject.id) {
      try {
        this.selectedProject.avgEstimationHours = await this.ProjectService.getProjectEstimationAvg(this.selectedProject?.id);
      } catch (error) {
        this.SnackBarService.open("Estimates could not be retrieved");
      }
    }
  }

  async selectProject(project: Project): Promise<void> {
    this.errorWarningProjectOverdue = '';

    this.selectedProject = project;

    // Update the form controls to reflect the selected project
    this.startDateControl.setValue(project.startDate, {emitEvent: false});

    // Update control locking state based on the selected project's status
    this.updateDateControls();

    try {
      await this.setSelectedProjectAvgEstimation();
      if (this.selectedProject && this.selectedProject.estimations) {
        this.countEstimatesByUser = this.selectedProject?.estimations?.length;
      }
      if (this.teams?.members) {
        this.maxEstimates = this.teams?.members?.filter(member => member.role === UserRole.Developer).length;
      }
      await this.refreshDates();
    } catch (error) {
      this.SnackBarService.open('Could not load estimate');
    }

    this.createWarningForOverDueProjects(project)
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

      this.projects = this.sortedProjects;

      if (this.roadmap) {
        this.roadmap.projects = [...this.projects];
      }
      this.updated = true
    }
  }

  get sortedProjects(): Project[] {
    return this.projects.sort((a, b) => {
      if (a.projectStatus === ProjectStatus.inBearbeitung) return -1; // Prioritize inBearbeitung
      if (b.projectStatus === ProjectStatus.inBearbeitung) return 1;
      return 0; // Maintain relative order for others
    });
  }

  async refreshDates() {
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

  async onSubmit() {
    this.progressBar.start();
    try {
      if (this.roadmap) {
        await this.RoadmapService.updateRoadmap(this.roadmap);
        await this.refreshProjectOrder();
      }
      if (this.user?.role === UserRole.Developer) {
        this.dataUpdated.emit(); // das hier verursacht ein doppeltes rendern der ersten roadmap. Unsicher ob es weggelassen werden kann für andere Updates.Scheint mir momentan nicht essenziell zu sein. Doch wenn es fehlt wird für Dev die Zeit nicht aktualisiert deshalb die if clause
      }
      this.SnackBarService.open('Project priority was successfully changed')
    } catch (error) {
      this.SnackBarService.open('An error has occurred during project prioritisation')
      this.progressBar.complete();
    } finally {
      this.progressBar.complete();
    }
  }


  async onDelete() {
    this.progressBar.start();
    if (this.roadmap?.projects && !(this.roadmap?.projects.length > 1)) {
      this.SnackBarService.open('Delete failed! The roadmap contains only one project')
      this.progressBar.complete();
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

        // this.dataUpdated.emit(); this causes prio position bug. But deleting might cause new unwanted behaviour. Observe

        this.SnackBarService.open('Project successfully deleted');
      } catch (error) {
        this.SnackBarService.open('Error when deleting the project');
        this.progressBar.complete();
      } finally {
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
        this.updateProjectStatusOnDate();
      }
    } catch (error) {
      this.SnackBarService.open('Error during refetch roadmap')
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
        this.SnackBarService.open('Error when fetching getProjectEstimationAvg')
      }
    }
  }

  private updateProjectStatusOnEstimates(): void {
    this.projects.forEach(project => {
      if (isProjectEstimatedAndNotInPlanningOrClosed(project)) {
        try {
          this.ProjectService.setProjectStatus(project.id!, ProjectStatus.inPlanung)
          project.projectStatus = ProjectStatus.inPlanung;
        } catch (error) {
          console.log(error)
        }
      }
      if (!isProjectEstimated(project)){
        try {
          this.ProjectService.setProjectStatus(project.id!, ProjectStatus.offen)
          project.projectStatus = ProjectStatus.offen;
        } catch (error) {
          console.log(error)
        }
      }
    });
  }

  createWarningForOverDueProjects(project: Project){
    const projectEndDate = project.endDate ? normalizeDate(new Date(project.endDate)) : null;

    if (projectEndDate && projectEndDate <= today) {
      this.errorWarningProjectOverdue='Deadline Exceeded!';
    }
  }

  // Comparing dates is so confusing
  private updateProjectStatusOnDate(): void {
    this.projects.forEach(async project => {
      const projectEndDate = project.endDate ? normalizeDate(new Date(project.endDate)) : null;
      if (project.startDate) {
        const projectStartDate = normalizeDate(new Date(project.startDate));

        // Project should be "in Bearbeitung" if start date is today or earlier and project is not closed
        if (projectStartDate <= today && project.projectStatus !== ProjectStatus.geschlossen && project.projectStatus !== ProjectStatus.inBearbeitung) {
          project.projectStatus = ProjectStatus.inBearbeitung;

          this.ProjectService.setProjectStatus(project.id!, ProjectStatus.inBearbeitung)
            //.then(() => console.log(`Persisted '${project.name}' as 'in Bearbeitung'`))
            .catch(error => console.error('Error updating project status:', error));
        }
      }
    });
    this.cdr.detectChanges();
  }

  getWarning(): string {
    if (this.selectedProject?.projectStatus === ProjectStatus.offen && !isProjectEstimatedAndNotInPlanningOrClosed(this.selectedProject)) {
      return "Missing estimates";
    }
    return '';
  }
}
