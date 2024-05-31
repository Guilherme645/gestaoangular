import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { ProjectEvent } from 'src/app/models/interfaces/enums/projects/ProjectEvent';
import { EventAction } from 'src/app/models/interfaces/projects/event/EventAction';
import { CreateProjectRequest } from 'src/app/models/interfaces/projects/event/request/CreateProjectRequest';
import { EditProjectRequest } from 'src/app/models/interfaces/projects/event/request/EditProjectRequest';
import { GetAllProjectsResponse } from 'src/app/models/interfaces/projects/response/GetAllProjectsResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ProjectsDataTransferService } from 'src/app/shared/services/projects/projects-data-transfer.service';


@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: []
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ nomeProjeto: string; code: string }> = [];
  public projectAction!: {
    event: EventAction;
    projectDatas: Array<GetAllProjectsResponse>;
  };
  public projectSelectedDatas!: GetAllProjectsResponse;
  public projectsDatas: Array<GetAllProjectsResponse> = [];

  // ADICONAR PROJETO
  public addProjectForm = this.formBuilder.group({
    id:['', Validators.required],
    nome:['', Validators.required],
    cnpj: ['', Validators.required],
        email: ['', Validators.required],
        razaoSocial: ['', Validators.required],
        endereco:['', Validators.required] ,
        quantidadeDeProjetos: ['', Validators.required],
        quantidadeDePessoas: ['', Validators.required],
        ativo: ['', Validators.required],
    dataAbertura: ['', Validators.required],
    dataFechamento: ['', Validators.required],
    dataPrevista: ['', Validators.required],
    status: ['', Validators.required],
  });

  // EDITAR PROJETO
  public editProjectForm = this.formBuilder.group({
    id: ['', Validators.required],
    nomeProjeto: ['', Validators.required],
    nome: ['', Validators.required],
    email: ['', Validators.required],
    cnpj: ['', Validators.required],
    razaoSocial: ['', Validators.required],
    endereco: ['', Validators.required],
    quantidadeDeProjetos: ['', Validators.required],
    quantidadeDePessoas: ['', Validators.required],
    ativo: ['', Validators.required],
    dataAbertura: ['', Validators.required],
    dataFechamento: ['', Validators.required],
    dataPrevista: ['', Validators.required],
    status: ['', Validators.required],
  });

  public addProjectAction = ProjectEvent.ADD_PROJECT_EVENT;
  public editProjectAction = ProjectEvent.EDIT_PROJECT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private projectsService: ProjectsService,
    private projectsDtService: ProjectsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig,

  ) { }
 
  ngOnInit(): void {
    this.projectAction = this.ref.data;

    if (
      this.projectAction?.event?.action === this.editProjectAction &&
      this.projectAction?.projectDatas
    ) {
      this.getProjectSelectedDatas(this.projectAction?.event?.id as string);
    }
      this.getProjectDatas();

this.getAllCategories();
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

  handleSubmitAddProject(): void {
    if (this.addProjectForm?.value && this.addProjectForm?.valid) {
      const requestCreateProject: CreateProjectRequest = {
        nome: this.addProjectForm.value.nome as string,
        cnpj: this.addProjectForm.value.cnpj as string,
        email: this.addProjectForm.value.email as string,
        razaoSocial: this.addProjectForm.value.razaoSocial as string,
        endereco: this.addProjectForm.value.endereco as string,
        quantidadeDeProjetos: this.addProjectForm.value.quantidadeDeProjetos as string,
        quantidadeDePessoas: this.addProjectForm.value.quantidadeDePessoas as string,
        ativo: this.addProjectForm.value.ativo as string,
        dataAbertura: this.addProjectForm.value.dataAbertura as string,
        dataFechamento: this.addProjectForm.value.dataFechamento as string,
        dataPrevista: this.addProjectForm.value.dataPrevista as string,
        status: this.addProjectForm.value.status as string,
        id: this.addProjectForm.value.status as string
      };

      this.projectsService
        .createProject(requestCreateProject)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success', 
                summary: 'Sucesso',
                detail: 'Projeto criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar projeto!',
              life: 2500,
            });
          },
        });
    }
    this.addProjectForm.reset();
  }
  
  handleSubmitEditProject(): void {
     if (this.editProjectForm.value && 
      this.editProjectForm.valid &&
    this.projectAction.event.id
  ) {
      
       const requestEditProject: EditProjectRequest = {
         nomeProjeto: this.editProjectForm.value.nomeProjeto as string,
         nome: this.editProjectForm.value.nome as string,
         email: this.editProjectForm.value.email as string,
         cnpj: this.editProjectForm.value.cnpj as string,
         razaoSocial: this.editProjectForm.value.razaoSocial as string,
         endereco: this.editProjectForm.value.endereco as string,
         quantidadeDeProjetos: this.editProjectForm.value.quantidadeDeProjetos as string,
         quantidadeDePessoas: this.editProjectForm.value.quantidadeDePessoas as string,
         ativo: this.editProjectForm.value.ativo as string,
         dataAbertura: this.editProjectForm.value.dataAbertura as string,
         dataFechamento: this.editProjectForm.value.dataFechamento as string,
         dataPrevista: null,
         status: this.editProjectForm.value.status as string,
         id: this.editProjectForm.value. id as string,
       }
     this.projectsService
        .editProject(requestEditProject)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto editado com sucesso!',
              life: 2500,
            });
            this.editProjectForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar projeto!',
              life: 2500,
            });
            this.editProjectForm.reset();
          },
        });
     }
  }
  getProjectSelectedDatas(projectId: string): void {
    const allProjects = this.projectAction?.projectDatas;

    if (allProjects.length > 0) {
      const projectFiltered = allProjects.filter(
        (element) => element?.id === projectId
      );

      if (projectFiltered) {
        this.projectSelectedDatas = projectFiltered[0];

        this.editProjectForm.setValue({
          id: this.projectSelectedDatas?.id,
          nomeProjeto: this.projectSelectedDatas?.nomeProjeto,
          nome: this.projectSelectedDatas?.nome,
          email: this.projectSelectedDatas?.email,
          cnpj: this.projectSelectedDatas?.cnpj,
          razaoSocial: this.projectSelectedDatas?.razaoSocial,
          endereco: this.projectSelectedDatas?.endereco,
          quantidadeDeProjetos: this.projectSelectedDatas?.quantidadeDeProjetos,
          quantidadeDePessoas: this.projectSelectedDatas?.quantidadeDePessoas,
          ativo: this.projectSelectedDatas?.ativo,
          dataAbertura: this.projectSelectedDatas?.dataAbertura,
          dataFechamento: this.projectSelectedDatas?.dataFechamento,
          dataPrevista: this.projectSelectedDatas?.dataPrevista,
          status: this.projectSelectedDatas?.status,
  
        });
      }
    }
  }

  getProjectDatas(): void {
    this.projectsService
      .getAllProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.projectsDatas = response;
            this.projectsDatas &&
              this.projectsDtService.setProjectsDatas(this.projectsDatas);
          }
        },
      });
  }

 ngOnDestroy(): void {
this.destroy$.next(); 
this.destroy$.complete(); }
}
