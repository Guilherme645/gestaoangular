import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateProjectResponse } from 'src/app/models/interfaces/clients/response/CreateProjectResponse';
import { CreateProjectRequest } from 'src/app/models/interfaces/projects/event/request/CreateProjectRequest';
import { EditProjectRequest } from 'src/app/models/interfaces/projects/event/request/EditProjectRequest';
import { DeleteProjectResponse } from 'src/app/models/interfaces/projects/response/DeleteProjectResponse';
import { GetAllProjectsResponse } from 'src/app/models/interfaces/projects/response/GetAllProjectsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllProjects(): Observable<Array<GetAllProjectsResponse>> {
    return this.http
      .get<Array<GetAllProjectsResponse>>(
        `${this.API_URL}/projetos`,
        this.httpOptions
      )

    }

  deleteProject(project_id: string): Observable<DeleteProjectResponse> {
    return this.http.delete<DeleteProjectResponse>(
      `${this.API_URL}/projetos/${project_id}`,
      {
        ...this.httpOptions,
      }
    );
  }

  createProject(requestDatas: CreateProjectRequest): Observable<CreateProjectResponse>{
    return this.http.post<CreateProjectResponse>(
      `${this.API_URL}/projetos`,
      requestDatas,
      this.httpOptions
    )
  }

  editProject(requestDatas: EditProjectRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/projetos`,
      requestDatas,
      this.httpOptions
    );
  }
}
