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
        let errorMessage = "Something bad happened; please try again later! ";
        if (!error.error || !error.error.error) {
          return throwError(errorMessage);
        }
        errorMessage +=error.error.message;
        console.error(errorMessage);
  
        return throwError(errorMessage);
      })
    );
  }
}
