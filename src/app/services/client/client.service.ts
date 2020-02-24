import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Client} from '../../models/client';
import * as config from '../../config/config.json';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly API_URL = config.apiUrl + '/client';

  constructor(private httpClient : HttpClient) { }

  public getClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.API_URL);
  }

  public getClient(id: number): Observable<Client> {
    return this.httpClient.get<Client>(this.API_URL + "/" + id);
  }

  public getClientByName(name: string): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.API_URL + "/"+ name);
  }

  public getClientByCompany(companyId: number): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.API_URL + "/company/"+ companyId);
  }

  public createClient(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(this.API_URL, client);
  }

  public updateClient(client: Client): void {
    this.httpClient.put(this.API_URL, client)
  }

  public deleteClient(id: number): void {
    this.httpClient.delete(this.API_URL + "/"+ id);
  }
}
