import { Injectable, Output, EventEmitter } from '@angular/core';
import * as config from '../../config/config.json';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { Receipt } from 'src/app/models/receipt.js';
import { catchError } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  @Output() receiptEmiter = new EventEmitter();
  saveReceiptDataEmitter = new ReplaySubject<Receipt>(1);

  private readonly API_URL = config.apiUrl + '/receipt';

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

  public getReceipts(): Observable<Receipt[]> {
    return this.httpClient.get<Receipt[]>(this.API_URL).pipe(
      catchError(this.handleError));
  }

  public getReceipt(id: number): Observable<Receipt> {
    return this.httpClient.get<Receipt>(this.API_URL + "/receiptId/" + id).pipe(
      catchError(this.handleError));
  }

  public getReceiptByClient(clientId: number): Observable<Receipt[]> {
    console.log(clientId + "KLIJENT ID")
    return this.httpClient.get<Receipt[]>(this.API_URL + "/client/"+ clientId).pipe(
      catchError(this.handleError));
  }

  public createReceipt(receipt: Receipt): Observable<Receipt> {
    
    return this.httpClient.post<Receipt>(this.API_URL, receipt).pipe(
      catchError(this.handleError));
  }

  public updateReceipt(receipt: Receipt):  Observable<Receipt>  {
    return this.httpClient.put<Receipt>(this.API_URL, receipt).pipe(
      catchError(this.handleError));
  }

  public deleteReceipt(id: number): Observable<{}> {
    return this.httpClient.delete(this.API_URL + "/"+ id, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
