import { Injectable } from '@angular/core';
import { response } from 'express';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllClientsResponse } from 'src/app/models/interfaces/clients/response/GetAllClientsResponse';

@Injectable({
  providedIn: 'root'
})
export class ClientsDataTransferService {
public clientsDataEmitter$ = 
new BehaviorSubject<Array<GetAllClientsResponse> | null >(null);
public clientsDatas: Array<GetAllClientsResponse> = [];


setClientsDatas(clients: Array<GetAllClientsResponse>):void {
  if (clients){
    this.clientsDataEmitter$.next(clients);
    this.getClientsDatas();
  }
}
  getClientsDatas() {
    this.clientsDataEmitter$
    .pipe(
      take(1),
      map((data) => data?.filter((clients) => clients.amount > 0))
    )
    .subscribe({
      next: (response) => {
        if (response) {
          this.clientsDatas = response;
        }
      },
    });
    return this.clientsDatas;
  }

}
