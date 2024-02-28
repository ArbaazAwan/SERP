import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublevelMenuFinancedashComponent } from './sublevel-menu-financedash.component';

describe('SublevelMenuFinancedashComponent', () => {
  let component: SublevelMenuFinancedashComponent;
  let fixture: ComponentFixture<SublevelMenuFinancedashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SublevelMenuFinancedashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SublevelMenuFinancedashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
