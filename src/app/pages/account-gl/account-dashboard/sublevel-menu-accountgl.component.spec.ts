import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublevelMenuAccountglComponent } from './sublevel-menu-accountgl.component';

describe('SublevelMenuAccountglComponent', () => {
  let component: SublevelMenuAccountglComponent;
  let fixture: ComponentFixture<SublevelMenuAccountglComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SublevelMenuAccountglComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SublevelMenuAccountglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
