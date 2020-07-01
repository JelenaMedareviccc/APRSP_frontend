import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import * as config from '../../config/config.json';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user.js';
import { map, catchError, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  router: any;
  private tokenExpirationTimer: any;

  private api = config.apiUrl + '/user/';

  user : BehaviorSubject<User> = new BehaviorSubject<User>(null);
  users : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  constructor(private http : HttpClient, private route: ActivatedRoute) { }

  signUp(userRegistration : User): Observable<User>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let options = { headers: headers};

    return this.http.post<User>(
      this.api+'signup',
      userRegistration,
      options
    ).pipe( tap(res => {
     
      this.handleAuthentication(res);
  
   

    })); 
  }




  login(user){
    let headers = new HttpHeaders().set('Content-Type', 'application/json');    
  
    let options = { headers: headers};

    return this.http.post(
      this.api+'signin', user,
      options
    ).pipe(tap(res => {
      this.handleAuthentication(res);
    }))
  }

  private handleAuthentication(res){
    let values = Object.keys(res).map( (r)  => { 
      return res[r]; 
    })
    const expiration = values[2];
    const expirationData = new Date(new Date().getTime() + expiration*2 );
    console.log(expirationData);
    const logUser = new User(values[3], values[0], values[1], expirationData );
    
    this.user.next(logUser);
    console.log("EXPIRATIOn");
    console.log(expiration*2);
    this.autoLogOut(expiration*2);
    res.expiration = new Date(new Date().getTime() + values[2]*2 );
    
     localStorage.setItem('userData', JSON.stringify(res));
  }

  logout(): boolean{
    this.user.next(null);
    localStorage.removeItem('userData');
     if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    } 
    if(localStorage.length != 0){
      return false;
    }  
    this.tokenExpirationTimer = null;

    return true;
    

  }

   autoLogin(){
    const userData = JSON.parse(localStorage.getItem('userData'));
 
    
    if(!userData){
      return;
    }

    const loadedUser = new User(userData['id'],userData['username'],userData['token'], userData['expiration']);
  
    if(loadedUser._token){

      this.user.next(loadedUser);
      const expirationDuration =new Date(userData.expiration).getTime() - new Date().getTime();
     this.autoLogOut(expirationDuration);
    }
  }
  



  autoLogOut(expirationDuration: number){
   this.tokenExpirationTimer = setTimeout(()=> {
      this.logout();
    }, expirationDuration)
} 

public getUser(id: number): Observable<User> {
  return this.http.get<User>(this.api + "userId/" +id);
}


  loginWithToken() : Observable<User>{
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization','Bearer '+token);
    headers = headers.append('Content-Type', 'application/json');
    let options = { headers: headers};
    
    this.http.get<User>(
      this.api+'login-with-token',
      options
    ).subscribe((data) => {
      this.user.next(data);
    });
    return this.user.asObservable();
  }

  saveUser(user : User){
    let token = localStorage.getItem('token'); // need to find a way to validate this  
    let headers = new HttpHeaders();
    headers = headers.append('Authorization','Bearer '+token);
    headers = headers.append('Content-Type', 'application/json');
    let options = { headers: headers};
    
    this.http.put<User>(
      this.api + '', 
      JSON.stringify(user),
      options
    ).subscribe((data) => {
      this.user.next(data);
    });

    return this.user.asObservable();

  }

  getUsers() : Observable<User[]>{
    let token = localStorage.getItem('token'); // need to find a way to validate this  
    let headers = new HttpHeaders();
    headers = headers.append('Authorization','Bearer '+token);
    headers = headers.append('Content-Type', 'application/json');
    let options = { headers: headers};
    
    this.http.get<User[]>(
      this.api,
      options
    ).subscribe((data) => {
      this.users.next(data);
    });

    return this.users.asObservable();
  }

  deleteUser(id : number) : Observable<User>{
    let token = localStorage.getItem('token'); // need to find a way to validate this  
    let headers = new HttpHeaders();
    headers = headers.append('Authorization','Bearer '+token);
    headers = headers.append('Content-Type', 'application/json');
    let options = { headers: headers};
    
    this.http.delete<User>(
      this.api + id,
      options
    ).subscribe((data) => {
      //this.user.next(data);
      this.getUsers();
    });

    return this.user.asObservable();
  }

  makeAdmin(id : number) : Observable<User>{
    let token = localStorage.getItem('token'); // need to find a way to validate this  
    let headers = new HttpHeaders();
    headers = headers.append('Authorization','Bearer '+token);
    headers = headers.append('Content-Type', 'application/json');
    let options = { headers: headers};
    
    this.http.get<User>(
      this.api + 'make-user-an-admin/' + id,
      options
    ).subscribe((data) => {
      this.getUsers();
    });

    return this.user.asObservable();
  }


}