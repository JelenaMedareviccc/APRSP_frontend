import { Injectable, Output, EventEmitter } from '@angular/core';
import * as config from '../../config/config.json';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Item } from 'src/app/models/item.js';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ItemService {


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


  @Output() itemEmitter= new EventEmitter();
  @Output() itemAddadEmitter= new EventEmitter();
  itemsList: Item[] = [];

  

  private readonly API_URL = config.apiUrl + '/item';

  constructor(private httpClient : HttpClient) { }

  public addItemInList(item:Item): Item[]{
    this.itemsList.push(item);
    console.log(this.itemsList);
    return this.itemsList;
  }

  public getItemsList(): Item[]{
    return this.itemsList;
  }

  public setItemsList(item: Item[]){
    this.itemsList = item;
  }

  public getItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.API_URL).pipe(
      catchError(this.handleError));
  }

  public getItem(id: number): Observable<Item> {
    return this.httpClient.get<Item>(this.API_URL + "/itemId/" + id).pipe(
      catchError(this.handleError));
  }

  public getItemByReceipt(receiptId: number): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.API_URL + "/receipt/"+ receiptId).pipe(
      catchError(this.handleError));
  }

  public createItem(item: Item): Observable<Item> {
    console.log(item);
    return this.httpClient.post<Item>(this.API_URL, item).pipe(
      catchError(this.handleError));
  }

  public updateItem(item: Item): Observable<Item> {
    return this.httpClient.put<Item>(this.API_URL, item).pipe(
      catchError(this.handleError));
  }

  public deleteItem(id: number): Observable<{}> {
   return this.httpClient.delete(this.API_URL + "/"+ id).pipe(
    catchError(this.handleError));
  }
}


