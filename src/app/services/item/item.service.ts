import { Injectable } from '@angular/core';
import * as config from '../../config/config.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.js';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly API_URL = config.apiUrl + '/item';

  constructor(private httpClient : HttpClient) { }

  public getItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.API_URL);
  }

  public getItem(id: number): Observable<Item> {
    return this.httpClient.get<Item>(this.API_URL + "/" + id);
  }

  public getItemByReceipt(receiptId: number): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.API_URL + "/receipt/"+ receiptId);
  }

  public createItem(item: Item): Observable<Item> {
    return this.httpClient.post<Item>(this.API_URL, item);
  }

  public updateItem(item: Item): void {
    this.httpClient.put(this.API_URL, item)
  }

  public deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + "/"+ id);
  }
}


