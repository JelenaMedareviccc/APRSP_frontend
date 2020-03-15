import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Company } from '../../models/company'
import { Observable, throwError } from 'rxjs';
import * as config from '../../config/config.json';
import { catchError } from 'rxjs/operators';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly API_URL = config.apiUrl + '/company';

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



  constructor(private httpClient : HttpClient) { }

    public getCompanies(): Observable<Company[]> {
        return this.httpClient.get<Company[]>(this.API_URL);
    }

    public getCompany(id: number): Observable<Company> {
        return this.httpClient.get<Company>(this.API_URL + "/" + id);
      }

    public createCompany(company: Company): Observable<Company> {
        return this.httpClient.post<Company>(this.API_URL, company);
    }

    public updateCompany(company: Company): Observable<Company>  {
        return this.httpClient.put<Company>(this.API_URL, company, httpOptions).pipe(
          catchError(this.handleError)
        );
    }

    public deleteCompany(id: number): void {
        this.httpClient.delete(this.API_URL + id);
    }
}
