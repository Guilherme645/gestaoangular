import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { CreateClientRequest } from 'src/app/models/interfaces/clients/event/request/CreateClientRequest';
import { EditClientRequest } from 'src/app/models/interfaces/clients/event/request/EditClienRequest';
import { GetAllClientsResponse } from 'src/app/models/interfaces/clients/response/GetAllClientsResponse';
import { ClientEvent } from 'src/app/models/interfaces/enums/clients/ClientEvent';
import { EventAction } from 'src/app/models/interfaces/projects/event/EventAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ClientsService } from 'src/app/services/clients/client.service';
import { ClientsDataTransferService } from 'src/app/shared/services/clients/clients-data-transfer.service';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: []
})
export class ClientFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ nome: string; code: string }> = [];
  public clientAction!: {
    event: EventAction;
    clientDatas: Array<GetAllClientsResponse>;
  };
  public clientSelectedDatas!: GetAllClientsResponse;
  public clientsDatas: Array<GetAllClientsResponse> = [];

  // adicionar clientes
  public addClientForm = this.formBuilder.group({
    nome:['', Validators.required],
    cnpj:['', Validators.required],
    razaoSocial: ['', Validators.required],
    endereco: ['', Validators.required],
        quantidadeProjetos: ['', Validators.required],
        quantidadePessoas: ['', Validators.required], 
        uf: ['', Validators.required],
        cep: ['', Validators.required],
        cidade: ['', Validators.required],
  });

  // editar clientes 
  public editClientForm = this.formBuilder.group({
    id: ['', Validators.required],
    nome: ['', Validators.required],
    cnpj: ['', Validators.required],
    razaoSocial: ['', Validators.required],
    endereco: ['', Validators.required],
    quantidadeDeProjetos: ['', Validators.required],
    quantidadeDePessoas: ['', Validators.required],
  });

  public addClientAction = ClientEvent.ADD_CLIENT_EVENT;
  public editClientAction = ClientEvent.EDIT_CLIENT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private clientsService: ClientsService,
    private clientsDtService: ClientsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig

  ) {}

  ngOnInit(): void {
    this.getAllCategories();

    if (
      this.clientAction?.event?.action === this.editClientAction &&
      this.clientAction?.clientDatas
    ) {
      this.getclientSelectedDatas(this.clientAction?.event?.id as string);
    }
      this.getclientDatas();

    this.getAllCategories();

    this.clientAction = this.ref.data;
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
      });
  }

  handleSubmitAddClient(): void {
    if (this.addClientForm?.value && this.addClientForm?.valid) {
      const requestCreateClient: CreateClientRequest = {
        nome: this.addClientForm.value.nome as string,
        cnpj: this.addClientForm.value.cnpj as string,
        razaoSocial: this.addClientForm.value.razaoSocial as string,
        endereco: this.addClientForm.value.endereco as string,
        quantidadeProjetos: Number(this.addClientForm.value.quantidadeProjetos) ,
        quantidadePessoas: Number(this.addClientForm.value.quantidadePessoas)  ,
        uf: this.addClientForm.value.uf as string,
        cep: this.addClientForm.value.cep as string,
        cidade: this.addClientForm.value. cidade as string,
      };
      this.clientsService
      .createClient(requestCreateClient)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso!',
              life: 2500,
            });
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto!',
            life: 2500,
          });
        },
      });
    }
    this.addClientForm.reset();
  }
  handleSubmitEditClient(): void {
    if (
      this.editClientForm.value &&
      this.editClientForm.valid &&
      this.clientAction.event.id
    ) {
      const requestEditClient: EditClientRequest = {
        id: this.editClientForm.value.id as string,
        nome: this.editClientForm.value.nome as string,
        cnpj: this.editClientForm.value.cnpj as string,
        razaoSocial: this.editClientForm.value.razaoSocial as string,
        endereco:this.editClientForm.value.endereco as string ,
        quantidadeDeProjetos: this.editClientForm.value.quantidadeDeProjetos as string,
        quantidadeDePessoas:this.editClientForm.value.quantidadeDePessoas as string
      };
     
      this.clientsService
        .editClient(requestEditClient)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editClientForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editClientForm.reset();
          },
        });
    }
  }
  getclientSelectedDatas(clientId: string): void {
    const allclients = this.clientAction?.clientDatas;

    if (allclients.length > 0) {
      const clientFiltered = allclients.filter(
        (element) => element?.id === clientId
      );

      if (clientFiltered) {
        this.clientSelectedDatas = clientFiltered[0];

        this.editClientForm.setValue({
          id: this.clientSelectedDatas?.id,
          nome: this.clientSelectedDatas?.nome,
          cnpj: this.clientSelectedDatas?.cnpj,
          razaoSocial: this.clientSelectedDatas?.razaoSocial,
          endereco: this.clientSelectedDatas?.endereco,
          quantidadeDeProjetos: this.clientSelectedDatas?.quantidadeDeProjetos,
          quantidadeDePessoas: this.clientSelectedDatas?.quantidadeDePessoas,
        });
        }
    }
  }
  getclientDatas(): void {
    this.clientsService
      .getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.content.length > 0) {
            this.clientsDatas = response.content;
            this.clientsDatas &&
              this.clientsDtService.setClientsDatas(this.clientsDatas);
          }
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}