import { TestBed } from '@angular/core/testing';

import { OutstandingService } from './outstanding.service';

describe('OutstandingService', () => {
  let service: OutstandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutstandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
