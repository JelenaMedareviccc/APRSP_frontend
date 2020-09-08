import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, ignoreElements } from "rxjs/operators";
import { Injectable } from "@angular/core";
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Something bad happened; please try again later";
        if (!error.error || !error.error.error) {
          return throwError(errorMessage);
        }

        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error("An error occurred:", error.error.message);
        } else if(error.error.error.message === "EMAIL_EXISTS"){
          errorMessage = "This email exist already!";
        } else if(error.error.error.message === "EMAIL_NOT_FOUND"){
          errorMessage = "This email does not exist!";
        } else if(error.error.error.message === "INVALID PASSWORD" ){
          errorMessage = "This password is not correct!";
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`
          );
        } 
        return throwError(errorMessage);
      })
    );
  }
}
