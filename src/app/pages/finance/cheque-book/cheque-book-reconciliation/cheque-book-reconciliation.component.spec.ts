import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookReconciliationComponent } from './cheque-book-reconciliation.component';

describe('ChequeBookReconciliationComponent', () => {
  let component: ChequeBookReconciliationComponent;
  let fixture: ComponentFixture<ChequeBookReconciliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookReconciliationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
