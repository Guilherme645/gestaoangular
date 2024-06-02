import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeleteClienttAction } from 'src/app/models/interfaces/clients/event/DeleteClientAction';
import { EventAction } from 'src/app/models/interfaces/clients/event/EventAction';
import { GetAllClientsResponse } from 'src/app/models/interfaces/clients/response/GetAllClientsResponse';
import { ClientEvent } from 'src/app/models/interfaces/enums/clients/ClientEvent';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: [],
})
export class ClientsTableComponent {
  @Input() clients: Array<GetAllClientsResponse> = [];
  @Output() clientEvent = new EventEmitter<EventAction>();
  @Output() deleteClientEvent = new EventEmitter<DeleteClienttAction>();


  public clientSelected!: GetAllClientsResponse;
  public addClientEvent = ClientEvent.ADD_CLIENT_EVENT;
  public editClientEvent = ClientEvent.EDIT_CLIENT_EVENT;

  handleClientEvent(action: string, id?: string): void{
    if(action && action !== ''){
      const ClientEventData = id && id !== ''? {action,id} : {action};
      this.clientEvent.emit(ClientEventData)
      // EMITIR VALOR DO EVENTO
    }
  }
  handleDeleteClient(client_id: string, nome: string): void{
    if(client_id !== '' && nome !== ''){
      this.deleteClientEvent.emit({
        client_id,
        nome,
      });
    }
  }
}

