import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublevelMenuHrpayrollDashComponent } from './sublevel-menu-hrpayroll-dash.component';

describe('SublevelMenuHrpayrollDashComponent', () => {
  let component: SublevelMenuHrpayrollDashComponent;
  let fixture: ComponentFixture<SublevelMenuHrpayrollDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SublevelMenuHrpayrollDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SublevelMenuHrpayrollDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
