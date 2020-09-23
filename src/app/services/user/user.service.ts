import { EventEmitter, Injectable, Output } from "@angular/core";
import {
  HttpClient,
  HttpHeaders
} from "@angular/common/http";
import * as config from "../../config/config.json";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "src/app/models/user.js";
import { tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService {

  private tokenExpirationTimer: any;

  private API_URL = config.apiUrl + "/user/";
  private API_URL_ADMIN = config.apiUrl+"/admin/"

  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);


  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private router:Router) {}

  signUp(userRegistration: User): Observable<User> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    let options = { headers: headers };
    console.log(userRegistration);
    return this.httpClient
      .post<User>(this.API_URL + "signup", userRegistration, options)
      .pipe(
        tap()
      );
  }

  login(user: User): Observable<User>  {
    let headers = new HttpHeaders().set("Content-Type", "application/json");

    let options = { headers: headers };

    return this.httpClient.post<User>(this.API_URL + "signin", user, options).pipe(
      tap((res) => {
        this.handleAuthentication(res);
      })
    );
  }

  private handleAuthentication(res) {
    let values = Object.keys(res).map((r) => {
      return res[r];
    });
    const expiration = res.expiration;
    const expirationData = new Date(new Date().getTime() + expiration * 2);
    console.log(expirationData);
    const logUser = new User(values[1], values[0], values[2], expirationData);
console.log(logUser);

  this.user.next(res);


    this.autoLogOut(expiration);
    console.log("expiration" + expiration);
    res.expiration = new Date(new Date().getTime() + res.expiration);
    console.log(res);
    console.log(JSON.stringify(res));
    localStorage.setItem("userData", JSON.stringify(res));

  }
 
  logout(): boolean {
    this.user.next(null);
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    if (localStorage.length != 0) {
      return false;
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/signin']);
    return true;
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData["id"],
      userData["username"],
      userData["token"],
      userData["expiration"]
    );

    if (loadedUser._token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData.expiration).getTime() - new Date().getTime();
      this.autoLogOut(expirationDuration);
    }
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);

  }

  public getUser(userId: number): Observable<User> {
    return this.httpClient.get<User>(this.API_URL + "userId/" + userId);
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL_ADMIN);
  }

  public updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(this.API_URL, user);
  }

  public deleteUser(userId: number): Observable<{}> {
    return this.httpClient.delete(this.API_URL  + userId);
  }

  public changePassword(password: string, token: string): Observable<User> {
    return this.httpClient.put<User>(this.API_URL + "changePassword?token=" + token , password);
  }

  public changeUserToAdmin(id:number): Observable<User> {
    return this.httpClient.put<User>(this.API_URL_ADMIN + "changeUserToAdmin/"+  id, null );
  }

  public comfirmRegistration(token: string): Observable<User>{
    return this.httpClient.get<User>(this.API_URL+ "comfirmRegistration?token="+ token).pipe(
      tap((res) => {
        this.handleAuthentication(res);
      })
    );
  }

  public getChangePasswordCode(username: String): Observable<Boolean>{
    return this.httpClient.get<Boolean>(this.API_URL + "getChangePasswordCode?username=" +username);

  }

}
