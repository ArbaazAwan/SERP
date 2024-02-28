import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnTypeComponent } from './yarn-type.component';

describe('YarnTypeComponent', () => {
  let component: YarnTypeComponent;
  let fixture: ComponentFixture<YarnTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YarnTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YarnTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
