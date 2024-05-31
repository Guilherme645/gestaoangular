/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientsDataTransferService } from './clients-data-transfer.service';

describe('Service: ClientsDataTransfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientsDataTransferService]
    });
  });

  it('should ...', inject([ClientsDataTransferService], (service: ClientsDataTransferService) => {
    expect(service).toBeTruthy();
  }));
});
