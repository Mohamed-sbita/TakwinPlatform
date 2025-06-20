import { TestBed } from '@angular/core/testing';

import { EmploiDuTempsService } from './emploi-du-temps.service';

describe('EmploiDuTempsService', () => {
  let service: EmploiDuTempsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploiDuTempsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
