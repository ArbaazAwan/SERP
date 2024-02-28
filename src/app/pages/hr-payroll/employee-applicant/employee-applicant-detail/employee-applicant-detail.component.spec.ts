import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApplicantDetailComponent } from './employee-applicant-detail.component';

describe('EmployeeApplicantDetailComponent', () => {
  let component: EmployeeApplicantDetailComponent;
  let fixture: ComponentFixture<EmployeeApplicantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeApplicantDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeApplicantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
