import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {   
          let errorMessage ="Something bad happened; please try again later";
          if(!error.error || !error.error.error){
            return throwError(errorMessage);
          }

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

          switch(error.error.error.message){
          case 'EMAIL_EXISTS':
            errorMessage ="This email exist already!"
            break;
          case 'EMAIL_NOT_FOUND': 
            errorMessage="This email does not exist!"
            break;
          case 'INVALID PASSWORD':{
            errorMessage="This password is not correct!"
            break;
          }
         }
         return throwError(errorMessage);
        })
      )
  }
}


 
