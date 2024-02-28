import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewResultComponent } from './interview-result.component';

describe('InterviewResultComponent', () => {
  let component: InterviewResultComponent;
  let fixture: ComponentFixture<InterviewResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
