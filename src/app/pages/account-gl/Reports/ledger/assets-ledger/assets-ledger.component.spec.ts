import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsLedgerComponent } from './assets-ledger.component';

describe('AssetsLedgerComponent', () => {
  let component: AssetsLedgerComponent;
  let fixture: ComponentFixture<AssetsLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
