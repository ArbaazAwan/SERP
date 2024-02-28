import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCodeComponent } from './company-code.component';

describe('CompanyCodeComponent', () => {
  let component: CompanyCodeComponent;
  let fixture: ComponentFixture<CompanyCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
