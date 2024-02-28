import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeHistoryComponent } from './cheque-history.component';

describe('ChequeHistoryComponent', () => {
  let component: ChequeHistoryComponent;
  let fixture: ComponentFixture<ChequeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
