import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBankComponent } from './employee-bank.component';

describe('EmployeeBankComponent', () => {
  let component: EmployeeBankComponent;
  let fixture: ComponentFixture<EmployeeBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
