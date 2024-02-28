import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantGatepassTypeComponent } from './applicant-gatepass-type.component';

describe('ApplicantGatepassTypeComponent', () => {
  let component: ApplicantGatepassTypeComponent;
  let fixture: ComponentFixture<ApplicantGatepassTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantGatepassTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantGatepassTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
