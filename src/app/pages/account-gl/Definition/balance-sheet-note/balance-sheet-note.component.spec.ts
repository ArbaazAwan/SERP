import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetNoteComponent } from './balance-sheet-note.component';

describe('BalanceSheetNoteComponent', () => {
  let component: BalanceSheetNoteComponent;
  let fixture: ComponentFixture<BalanceSheetNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceSheetNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSheetNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
