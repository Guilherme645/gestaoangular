import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientsDataTransferService } from 'src/app/shared/services/clients/clients-data-transfer.service';
import { GetAllClientsResponse } from 'src/app/models/interfaces/clients/response/GetAllClientsResponse';
import { ClientsService } from 'src/app/services/clients/client.service';
import { EventAction } from 'src/app/models/interfaces/clients/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientFormComponent } from '../../components/client-form/client-form.component';

@Component({
  selector: 'app-clients-home',
  templateUrl: './clients-home.component.html',
  styleUrls: [],
})
export class ClientsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public clientsDatas: Array<GetAllClientsResponse> = [];

  constructor(
    private clientsService: ClientsService,
    private clientsDtService: ClientsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService

  ) {}

  ngOnInit(): void {
    this.getServiceClientsDatas();
  }

  getServiceClientsDatas() {
    const clientsLoaded = this.clientsDtService.getClientsDatas();

    if (clientsLoaded.length > 0) {
      this.clientsDatas = clientsLoaded;
    } else this.getAPIClientsDatas();

  }

  getAPIClientsDatas() {
    this.clientsService
      .getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.clientsDatas = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar clientes',
            life: 2500,
          });
          // this.router.navigate(['/dashboard']);
        },
      });
  }

  handleClientsAction(event: EventAction): void{
    if (event) {
      this.ref = this.dialogService.open(ClientFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productDatas: this.clientsDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIClientsDatas(),
      });
    }
  }

  handleDeleteClientAction(event:{
    client_id: string;
    nome: string;
  }): void{
    if(event){
      this.confirmationService.confirm({
        message: `Confirma a exlusão do cliente: ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-ExclamationTriangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteClient(event?.client_id), 
      }) 
       }
  }
  deleteClient(client_id: string) {
    if(client_id) {
this.clientsService 
.deleteClient(client_id)
.pipe(takeUntil(this.destroy$))
.subscribe({ 
  next: (response) => {
    if(response) {
      this.messageService.add({
        severity: 'sucess',
        summary: 'Sucesso',
        detail: 'Produto removido com sucesso!',
        life: 2500,
      });

      this.getAPIClientsDatas();
    }
  },
  error: (err) => {
    console.log(err);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao remover cliente'
    });
  },
});
  }  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
