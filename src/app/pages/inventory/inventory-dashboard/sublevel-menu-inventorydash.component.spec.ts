import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublevelMenuInventorydashComponent } from './sublevel-menu-inventorydash.component';

describe('SublevelMenuInventorydashComponent', () => {
  let component: SublevelMenuInventorydashComponent;
  let fixture: ComponentFixture<SublevelMenuInventorydashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SublevelMenuInventorydashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SublevelMenuInventorydashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
