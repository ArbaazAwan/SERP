import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApplicantComponent } from './employee-applicant.component';

describe('EmployeeApplicantComponent', () => {
  let component: EmployeeApplicantComponent;
  let fixture: ComponentFixture<EmployeeApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
