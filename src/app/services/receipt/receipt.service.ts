import { Injectable } from '@angular/core';
import * as config from '../../config/config.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt } from 'src/app/models/receipt.js';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private readonly API_URL = config.apiUrl + '/receipt';

  constructor(private httpClient : HttpClient) { }

  public getReceipts(): Observable<Receipt[]> {
    return this.httpClient.get<Receipt[]>(this.API_URL);
  }

  public getReceipt(id: number): Observable<Receipt> {
    return this.httpClient.get<Receipt>(this.API_URL + "/" + id);
  }

  public getReceiptByClient(clientId: number): Observable<Receipt[]> {
    return this.httpClient.get<Receipt[]>(this.API_URL + "/client/"+ clientId);
  }

  public createReceipt(receipt: Receipt): Observable<Receipt> {
    return this.httpClient.post<Receipt>(this.API_URL, receipt);
  }

  public updateReceipt(receipt: Receipt): void {
    this.httpClient.put(this.API_URL, receipt)
  }

  public deleteReceipt(id: number): void {
    this.httpClient.delete(this.API_URL + "/"+ id);
  }
}
