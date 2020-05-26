import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {Client} from '../../models/client';
import * as config from '../../config/config.json';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  @Output() clientEmiter = new EventEmitter();

  private readonly API_URL = config.apiUrl + '/client';

  constructor(private httpClient : HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  public getClients(): Observable<Client[]> {
    console.log(this.httpClient.get<Client[]>(this.API_URL));
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
 
    return this.httpClient.post<Client>(this.API_URL, JSON.stringify(client), httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError));
  }

  public updateClient(client: Client): Observable<Client> {
    return this.httpClient.put<Client>(this.API_URL, client)
  }

  public deleteClient(id: number): Observable<{}> {
    return this.httpClient.delete(this.API_URL + "/"+ id, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
