import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDefinitionComponent } from './employee-definition.component';

describe('EmployeeDefinitionComponent', () => {
  let component: EmployeeDefinitionComponent;
  let fixture: ComponentFixture<EmployeeDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
