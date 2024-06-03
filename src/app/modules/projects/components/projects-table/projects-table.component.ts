import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectEvent } from 'src/app/models/interfaces/enums/projects/ProjectEvent';
import { DeleteProjectAction } from 'src/app/models/interfaces/projects/event/DeleteProjectAction';
import { EventAction } from 'src/app/models/interfaces/projects/event/EventAction';
import { GetAllProjectsResponse } from 'src/app/models/interfaces/projects/response/GetAllProjectsResponse';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: [],
})
export class ProjectsTableComponent {
  @Input() projects: Array<GetAllProjectsResponse> = [];
  @Output() projectEvent = new EventEmitter<EventAction>();
  @Output() deleteProjectEvent = new EventEmitter<DeleteProjectAction>();

  public projectSelected!: GetAllProjectsResponse;
  public addProjectEvent = ProjectEvent.ADD_PROJECT_EVENT;
  public editProjectEvent = ProjectEvent.EDIT_PROJECT_EVENT;

  handleProjectEvent(action: string, id?: string): void {
    console.log('HELLO');
    console.log(action, id);
    if (action && action !== '') {
      const ProjectEventData = id && id !== '' ? { action, id } : { action };
      this.projectEvent.emit(ProjectEventData);
    }
  }

  handleEditProject(id: string) {
    // this.handleProjectEvent(this.editProjectEvent, id);
    this.projectEvent.emit({
      action: this.editProjectEvent,
      id,
    });
  }

  handleDeleteProject(project_id: string, nome: string): void {
    if (project_id !== '' && nome !== '') {
      this.deleteProjectEvent.emit({
        project_id,
        nome,
      });
    }
  }
}
