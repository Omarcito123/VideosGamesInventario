import { TestBed } from '@angular/core/testing';

import { ExcelServicesServiceService } from './excel-services-service.service';

describe('ExcelServicesServiceService', () => {
  let service: ExcelServicesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelServicesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
