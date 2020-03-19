import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from '../../models/company'
import { Observable } from 'rxjs';
import * as config from '../../config/config.json';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly API_URL = config.apiUrl + '/company';
 

  constructor(private httpClient : HttpClient) { }

    public getCompanies(): Observable<Company[]> {
        return this.httpClient.get<Company[]>(this.API_URL);
    }

    public getCompany(id: number): Observable<Company> {
        return this.httpClient.get<Company>(this.API_URL + "/" + id);
      }

    public createCompany(company: Company): Observable<Company> {
        return this.httpClient.post<Company>(this.API_URL, JSON.stringify(company));
    }

    public updateCompany(company: Company): void {
        this.httpClient.put(this.API_URL, company)
    }

    public deleteCompany(id: number): void {
        this.httpClient.delete(this.API_URL + id);
    }
}
