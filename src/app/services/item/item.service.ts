import { Injectable, Output, EventEmitter } from '@angular/core';
import * as config from '../../config/config.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.js';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  @Output() itemEmitter= new EventEmitter();
  @Output() itemAddadEmitter= new EventEmitter();
  items: Item[];

  private readonly API_URL = config.apiUrl + '/item';

  constructor(private httpClient : HttpClient) { }

  public addItemInList(item:Item): Item[]{
    this.items.push(item);
    return this.items;
  }

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

  public updateItem(item: Item): Observable<Item> {
    return this.httpClient.put<Item>(this.API_URL, item)
  }

  public deleteItem(id: number): Observable<{}> {
   return this.httpClient.delete(this.API_URL + "/"+ id);
  }
}


