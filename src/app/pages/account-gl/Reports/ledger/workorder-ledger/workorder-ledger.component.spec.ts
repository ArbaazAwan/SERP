import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderLedgerComponent } from './workorder-ledger.component';

describe('WorkorderLedgerComponent', () => {
  let component: WorkorderLedgerComponent;
  let fixture: ComponentFixture<WorkorderLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
