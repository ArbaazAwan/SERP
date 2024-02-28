import { TestBed } from '@angular/core/testing';

import { IrnService } from './irn.service';

describe('IrnService', () => {
  let service: IrnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IrnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
