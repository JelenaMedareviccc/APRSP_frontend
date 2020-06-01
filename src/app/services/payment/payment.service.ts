import { Injectable, EventEmitter, Output } from '@angular/core';
import * as config from '../../config/config.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from 'src/app/models/payment.js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  @Output() paymentEmitter=new EventEmitter();
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

  public updatePayment(payment: Payment): Observable<Payment> {
    return this.httpClient.put<Payment>(this.API_URL, payment)
  }

  public deletePayment(id: number): Observable<{}> {
   return this.httpClient.delete(this.API_URL + "/"+ id);
  }
}
