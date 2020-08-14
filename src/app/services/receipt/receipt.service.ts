import { Injectable, Output, EventEmitter } from "@angular/core";
import * as config from "../../config/config.json";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, ReplaySubject } from "rxjs";
import { Receipt } from "src/app/models/receipt.js";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }),
};

@Injectable({
  providedIn: "root",
})
export class ReceiptService {
  @Output() receiptEmiter = new EventEmitter();
  saveReceiptDataEmitter = new ReplaySubject<Receipt>(1);

  private readonly API_URL = config.apiUrl + "/receipt";

  constructor(private httpClient: HttpClient) {}

  public getReceipts(): Observable<Receipt[]> {
    return this.httpClient.get<Receipt[]>(this.API_URL);
  }

  public getReceipt(id: number): Observable<Receipt> {
    return this.httpClient.get<Receipt>(this.API_URL + "/receiptId/" + id);
  }

  public getReceiptByClient(clientId: number): Observable<Receipt[]> {
    console.log(clientId + "KLIJENT ID");
    return this.httpClient.get<Receipt[]>(this.API_URL + "/client/" + clientId);
  }

  public createReceipt(receipt: Receipt): Observable<Receipt> {
    return this.httpClient.post<Receipt>(this.API_URL, receipt);
  }

  public updateReceipt(receipt: Receipt): Observable<Receipt> {
    return this.httpClient.put<Receipt>(this.API_URL, receipt);
  }

  public deleteReceipt(id: number): Observable<{}> {
    return this.httpClient.delete(this.API_URL + "/" + id, httpOptions);
  }

  public getLastYearReceipts(id: number): Observable<Receipt[]> {
    console.log(id);
    return this.httpClient.get<Receipt[]>(
      this.API_URL + "/" + id + "/filteredReceiptsLastYear"
    );
  }

  public getLast365DaysReceipts(id: number): Observable<Receipt[]> {
    console.log(id);
    return this.httpClient.get<Receipt[]>(
      this.API_URL + "/" + id + "/filteredReceiptsLast365Days"
    );
  }

  public getReceiptsBetweenTwoDates(
    id: number,
    startDate: String,
    endDate: String
  ): Observable<Receipt[]> {
    console.log(id, startDate, endDate);
    return this.httpClient.get<Receipt[]>(
      this.API_URL +
        "/" +
        id +
        "/filterBetweenTwoDates/?startDate=" +
        startDate +
        "&endDate=" +
        endDate
    );
  }

  public getReceiptsForSelectedYear(
    id: number,
    year: String
  ): Observable<Receipt[]> {
    
    return this.httpClient.get<Receipt[]>(
      this.API_URL +
        "/" +
        id +
        "/filteredReceiptForSelectedYear/?year=" +
        year 
        
    );
  }

  public getReceiptByUser(userId: number): Observable<Receipt[]> {
    return this.httpClient.get<Receipt[]>(
      this.API_URL + "/user/" + userId
    );
  }
}
