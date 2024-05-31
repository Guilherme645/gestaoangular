/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectsDataTransferService } from './projects-data-transfer.service';

describe('Service: ProjectsDataTransfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsDataTransferService]
    });
  });

  it('should ...', inject([ProjectsDataTransferService], (service: ProjectsDataTransferService) => {
    expect(service).toBeTruthy();
  }));
});
