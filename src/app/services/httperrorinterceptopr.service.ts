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
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}
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
        errorMessage += error.error.message;
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }
}
