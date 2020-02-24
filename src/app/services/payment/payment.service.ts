import { Injectable } from '@angular/core';
import * as config from '../../config/config.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from 'src/app/models/payment.js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = config.apiUrl + '/payment';

  constructor(private httpClient : HttpClient) { }

  public getPayments(): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.API_URL);
  }

  public getPayment(id: number): Observable<Payment> {
    return this.httpClient.get<Payment>(this.API_URL + "/" + id);
  }

  public getPaymentByReceipt(receiptId: number): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.API_URL +"/receipt/" + receiptId);
  }

  public createPayment(payment: Payment): Observable<Payment> {
    return this.httpClient.post<Payment>(this.API_URL, payment);
  }

  public updatePayment(payment: Payment): void {
    this.httpClient.put(this.API_URL, payment)
  }

  public deletePayment(id: number): void {
    this.httpClient.delete(this.API_URL + "/"+ id);
  }
}
