import { TestBed } from '@angular/core/testing';

import { ChartserviceService } from './chartservice.service';

describe('ChartserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartserviceService = TestBed.get(ChartserviceService);
    expect(service).toBeTruthy();
  });
});
