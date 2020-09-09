import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Client } from "../../models/client";
import { ClientPayment } from "../../models/clientpayment";
import * as config from "../../config/config.json";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class ClientService {
  @Output() clientEmiter = new EventEmitter();

  private readonly API_URL = config.apiUrl + "/client";

  constructor(private httpClient: HttpClient) {}

  public getClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.API_URL);
  }

  public getClient(id: number): Observable<Client> {
    return this.httpClient.get<Client>(this.API_URL + "/" + id);
  }

  public getClientByName(name: string): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.API_URL + "/" + name);
  }

  public getClientByCompany(companyId: number): Observable<Client[]> {
    return this.httpClient.get<Client[]>(
      this.API_URL + "/company/" + companyId
    );
  }

  public createClient(client: Client): Observable<Client> {
    console.log(client);
    return this.httpClient.post<Client>(
      this.API_URL,
      JSON.stringify(client),
      httpOptions
    );
  }

  public updateClient(client: Client): Observable<Client> {
    return this.httpClient.put<Client>(this.API_URL, client);
  }

  public deleteClient(id: number): Observable<{}> {
    return this.httpClient.delete(this.API_URL + "/" + id, httpOptions);
  }

   public getClientByUser(userId: number): Observable<Client[]> {
    return this.httpClient.get<Client[]>(
      this.API_URL + "/user/" + userId
    );
  }

  public getClientsPayment(companyId: number, year: String): Observable<ClientPayment[]> {
    return this.httpClient.get<ClientPayment[]>(
      this.API_URL + "/company/" + companyId+ "/paymentPercentage?year="+ year
    );
  }
}
