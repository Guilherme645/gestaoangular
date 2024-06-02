import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Observable, Subject, elementAt } from 'rxjs';
import { GetAllClientsResponse } from 'src/app/models/interfaces/clients/response/GetAllClientsResponse';
import { GetAllProjectsResponse } from 'src/app/models/interfaces/projects/response/GetAllProjectsResponse';
import { ClientsService } from 'src/app/services/clients/client.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ClientsDataTransferService } from 'src/app/shared/services/clients/clients-data-transfer.service';
import { ProjectsDataTransferService } from 'src/app/shared/services/projects/projects-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  public projectsList: GetAllProjectsResponse[] = [];
  public clientsList: GetAllClientsResponse[] = [];
  public projectsChartDatas!: ChartData;
  public projectsChartOptions!: ChartOptions;
  public clientsChartDatas!: ChartData;
  public clientsChartOptions!: ChartOptions;
  private destroy$ = new Subject<void>();

  constructor(
    private projectsService: ProjectsService,
    private messageService: MessageService,
    private clientsService: ClientsService, 
    private projectsDtService: ProjectsDataTransferService,
    private clientsDtService: ClientsDataTransferService

  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();    }

  ngOnInit(): void {
    this.getProjectsDatas(); 
    this.getClientsDatas();
  }

  getClientsDatas(): void {
    this.clientsService.getAllClients().subscribe({
      next: (response: any) => {
        console.log ('teste')
        if (response.content.length > 0) {
          this.clientsList = response.content;
          this.clientsDtService.setClientsDatas(this.clientsList);
          this.setClientsChartConfig();

        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar clientes:', err);
        this.messageService.add({
          severity: 'error',

          
          summary: 'Erro',
          detail: 'Erro ao buscar clientes!',
          life: 2500,
        });
      }
    });
  }
  setClientsChartConfig(): void{
    if(this.projectsList.length > 0){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.clientsChartDatas = {
      labels: this.clientsList.map((element) => element?.nome),
      datasets:[
        {
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.clientsList.map((element) => element?.amount),
        },
      ],
    };

    this.clientsChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels:{
            color: textColor
          }
        }
      },

      scales:{
        x:{
          ticks:{
            color: textColorSecondary,
            font:{
              weight:'bolder',
            },
          },
          grid:{
            color:surfaceBorder,
          },
        },
        y:{
          ticks:{
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
  getProjectsDatas(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (response: any) => {
        console.log (response)
        if (response.content.length > 0) {
          this.projectsList = response.content;
        this.projectsDtService.setProjectsDatas(this.projectsList);
        this.setProjectsChartConfig();
}
      },
      error: (err: any) => {
        console.error('Erro ao buscar projetos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar projetos!',
          life: 2500,
        });
      },
    });
  }

  setProjectsChartConfig(): void{
    if(this.projectsList.length > 0){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.projectsChartDatas = {
      labels: this.projectsList.map((element) => element?.nomeProjeto),
      datasets:[
        {
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.projectsList.map((element) => element?.amount),
        },
      ],
    };

    this.projectsChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels:{
            color: textColor
          }
        }
      },

      scales:{
        x:{
          ticks:{
            color: textColorSecondary,
            font:{
              weight:'bolder',
            },
          },
          grid:{
            color:surfaceBorder,
          },
        },
        y:{
          ticks:{
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
}
