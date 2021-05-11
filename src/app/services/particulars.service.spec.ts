import { TestBed } from '@angular/core/testing';

import { ParticularsService } from './particulars.service';

describe('ParticularsService', () => {
  let service: ParticularsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticularsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
