import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationLevelsComponent } from './designation-levels.component';

describe('DesignationLevelsComponent', () => {
  let component: DesignationLevelsComponent;
  let fixture: ComponentFixture<DesignationLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationLevelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
