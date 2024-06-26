import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateClientRequest } from 'src/app/models/interfaces/clients/event/request/CreateClientRequest';
import { EditClientRequest } from 'src/app/models/interfaces/clients/event/request/EditClienRequest';
import { CreateClientResponse } from 'src/app/models/interfaces/clients/response/CreateClientResponse';
import { DeleteClientResponse } from 'src/app/models/interfaces/clients/response/DeleteClientResponse';
import { GetAllClientsResponse } from 'src/app/models/interfaces/clients/response/GetAllClientsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) { }

  getAllClients(): Observable<Array<GetAllClientsResponse>> {
    return this.http
      .get<Array<GetAllClientsResponse>>(
        `${this.API_URL}/clientes`,
        this.httpOptions
      )
  }

  deleteClient(client_id: string): Observable<DeleteClientResponse> {
    return this.http.delete<DeleteClientResponse>(
      `${this.API_URL}/clientes/${client_id}`,
      {
        ...this.httpOptions,
      }
    );
  }

  createClient(
    requestDatas: CreateClientRequest
  ): Observable<CreateClientResponse> {
    return this.http.post<CreateClientResponse>(
      `${this.API_URL}/clientes`,
      {
        cep: requestDatas.cep,
        cidade: requestDatas.cidade,
        nome: requestDatas.nome,
        uf: requestDatas.uf,
        cnpj: requestDatas.cnpj,
        razaoSocial: requestDatas.razaoSocial,
        quantidadePessoas:Number (requestDatas.quantidadePessoas),
        quantidadeProjetos: Number(requestDatas.quantidadeProjetos),
        endereco: requestDatas.endereco

      } as CreateClientRequest
      ,
      this.httpOptions
    );
  }
  editClient(requestDatas: EditClientRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/clientes`,
      requestDatas,
      this.httpOptions
    );
  }
}

