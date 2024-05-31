/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CategoriesClientService } from './categoriesClient.service';

describe('Service: CategoriesClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesClientService]
    });
  });

  it('should ...', inject([CategoriesClientService], (service: CategoriesClientService) => {
    expect(service).toBeTruthy();
  }));
});
