import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDivComponent } from './branch-div.component';

describe('BranchDivComponent', () => {
  let component: BranchDivComponent;
  let fixture: ComponentFixture<BranchDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchDivComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
