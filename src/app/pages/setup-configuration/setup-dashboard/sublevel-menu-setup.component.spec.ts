import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublevelMenuSetupComponent } from './sublevel-menu-setup.component';

describe('SublevelMenuSetupComponent', () => {
  let component: SublevelMenuSetupComponent;
  let fixture: ComponentFixture<SublevelMenuSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SublevelMenuSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SublevelMenuSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
