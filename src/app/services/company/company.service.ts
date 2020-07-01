import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Company } from "../../models/company";
import { Observable, ReplaySubject } from "rxjs";
import * as config from "../../config/config.json";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  private readonly API_URL = config.apiUrl + "/company";
  companyEmitter = new ReplaySubject(1);

  constructor(private httpClient: HttpClient) {}

  public getCompanies(): Observable<Company[]> {
    return this.httpClient.get<Company[]>(this.API_URL);
  }

  public getCompany(id: number): Observable<Company> {
    return this.httpClient.get<Company>(this.API_URL + "/" + id);
  }

  public createCompany(company: Company): Observable<Company> {
    console.log(company);
    console.log(JSON.stringify(company));
    return this.httpClient.post<Company>(this.API_URL, company);
  }

  public updateCompany(company: Company): Observable<Company> {
    return this.httpClient.put<Company>(this.API_URL, company);
  }

  public deleteCompany(id: number): Observable<Company> {
    return this.httpClient.delete<Company>(this.API_URL + "/" + id);
  }

  public getCompanyByUser(userId: number): Observable<Company[]> {
    return this.httpClient.get<Company[]>(this.API_URL + "/user/" + userId);
  }
}
