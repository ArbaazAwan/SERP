import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentRequirementComponent } from './recruitment-requirement.component';

describe('RecruitmentRequirementComponent', () => {
  let component: RecruitmentRequirementComponent;
  let fixture: ComponentFixture<RecruitmentRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
