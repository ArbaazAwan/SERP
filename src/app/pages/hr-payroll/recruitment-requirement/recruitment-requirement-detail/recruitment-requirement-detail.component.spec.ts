import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentRequirementDetailComponent } from './recruitment-requirement-detail.component';

describe('RecruitmentRequirementDetailComponent', () => {
  let component: RecruitmentRequirementDetailComponent;
  let fixture: ComponentFixture<RecruitmentRequirementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentRequirementDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentRequirementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
