import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
  HttpHeaders,
} from "@angular/common/http";
import { UserService } from "./user.service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.userService.user.pipe(
      take(1),
      exhaustMap((user) => {
        console.log("INTERECEPTION");
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: new HttpHeaders()
            .append("Authorization", "Bearer " + user.token)
            .append("Content-Type", "application/json"),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
