import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublevelMenuPosDashboardComponent } from './sublevel-menu-pos-dashboard.component';

describe('SublevelMenuPosDashboardComponent', () => {
  let component: SublevelMenuPosDashboardComponent;
  let fixture: ComponentFixture<SublevelMenuPosDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SublevelMenuPosDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SublevelMenuPosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
