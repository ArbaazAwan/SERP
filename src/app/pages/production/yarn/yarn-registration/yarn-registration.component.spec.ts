import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnRegistrationComponent } from './yarn-registration.component';

describe('YarnRegistrationComponent', () => {
  let component: YarnRegistrationComponent;
  let fixture: ComponentFixture<YarnRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YarnRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YarnRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
