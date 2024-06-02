import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectsService } from '../../../../services/projects/projects.service';
import { ProjectsDataTransferService } from 'src/app/shared/services/projects/projects-data-transfer.service';
import { GetAllProjectsResponse } from 'src/app/models/interfaces/projects/response/GetAllProjectsResponse';
import { EventAction } from 'src/app/models/interfaces/projects/event/EventAction';
import { ExclamationTriangleIcon } from 'primeng/icons/exclamationtriangle';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProjectFormComponent } from '../../components/projects-table/project-form/project-form.component';

@Component({
  selector: 'app-projects-home',
  templateUrl: './projects-home.component.html',
  styleUrls: [],
})
export class ProjectsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public projectsDatas: Array<GetAllProjectsResponse> = [];

  constructor(
    private projectsService: ProjectsService,
    private projectsDtService: ProjectsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.getServiceProjectsDatas();
  }

  getServiceProjectsDatas() {
    const projectsLoaded = this.projectsDtService.getProjectsDatas();

    if (projectsLoaded.length > 0) {
      this.projectsDatas = projectsLoaded;
    } else this.getAPIProjectsDatas();

  }

  getAPIProjectsDatas() {
    this.projectsService
      .getAllProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.content.length > 0) {
            this.projectsDatas = response.content;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProjectsAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ProjectFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productDatas: this.projectsDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIProjectsDatas(),
      });
    }
  }

  handleDeleteProjectAction(event: {
    project_id: string;
    nome: string;
  }): void {
    console.log (event)
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exlusão do projeto: ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-ExclamationTriangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProject(event?.project_id),
      })
    }
  }

  deleteProject(project_id: string) {
    if (project_id) {
      this.projectsService
        .deleteProject(project_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'sucess',
                summary: 'Sucesso',
                detail: 'Produto removido com sucesso!',
                life: 2500,
              });

              this.getAPIProjectsDatas();
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover projeto'
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
