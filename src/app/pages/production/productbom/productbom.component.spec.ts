import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductbomComponent } from './productbom.component';

describe('ProductbomComponent', () => {
  let component: ProductbomComponent;
  let fixture: ComponentFixture<ProductbomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductbomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductbomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
