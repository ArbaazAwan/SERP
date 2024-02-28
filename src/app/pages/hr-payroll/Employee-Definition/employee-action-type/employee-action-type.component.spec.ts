import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeActionTypeComponent } from './employee-action-type.component';

describe('EmployeeActionTypeComponent', () => {
  let component: EmployeeActionTypeComponent;
  let fixture: ComponentFixture<EmployeeActionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeActionTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeActionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
