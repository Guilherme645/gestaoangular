/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientsService } from './client.service';

describe('Service: Client', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientsService]
    });
  });

  it('should ...', inject([ClientsService], (service: ClientsService) => {
    expect(service).toBeTruthy();
  }));
});
