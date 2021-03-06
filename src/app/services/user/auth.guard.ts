import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { map, take } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.userService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;

        if (isAuth) {
          if (
            state.url.includes("users") ||
            state.url.includes("changeToAdmin")
          ) {
            console.log(state.url);
            this.userService.getUser(user.id).subscribe((user) => {
              if (user.role.name !== "ROLE_ADMIN") {
                this.router.navigate(["/company"]);
                return false;
              } else {
                console.log(state.url);
                return true;
              }
            });
          } else {
            console.log(state.url);
            return true;
          }
        } else {
          return this.router.createUrlTree(["/signin"]);
        }
      })
    );
  }
}
