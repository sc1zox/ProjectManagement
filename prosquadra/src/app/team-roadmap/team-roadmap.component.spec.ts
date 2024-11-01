import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRoadmapComponent } from './team-roadmap.component';

describe('TeamRoadmapComponent', () => {
  let component: TeamRoadmapComponent;
  let fixture: ComponentFixture<TeamRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamRoadmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
