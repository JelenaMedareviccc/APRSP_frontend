import { Injectable } from '@angular/core';
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

  private handlerError(error: HttpErrorResponse){
    let errorMessage = "An unknown error occured!"
    if(!error.error || !error.error.error){
      return throwError(errorMessage);
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
  }

  private api = config.apiUrl + '/user/';

  user : BehaviorSubject<User> = new BehaviorSubject<User>(null);
  users : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  constructor(private http : HttpClient, private route: ActivatedRoute) { }

  signUp(userRegistration : User): Observable<User>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let options = { headers: headers};
    console.log(userRegistration);
    return this.http.post<User>(
      this.api+'signup',
      userRegistration,
      options
    ).pipe(catchError(this.handlerError), tap(res => {
     
      this.handleAuthentication(res);
     // const expirationDate = new Date(new Date().getTime() + )
   

    })); 
  }




  login(user){

   // localStorage.setItem('token', '');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');    
  
   // let params = new HttpParams().set("username",username).set("password", password); //Create new HttpParams
   
    let options = { headers: headers};

    return this.http.post(
      this.api+'signin', user,
      options
    ).pipe(catchError(this.handlerError), tap(res => {
      this.handleAuthentication(res);
    }))
  }

  private handleAuthentication(res){
    let values = Object.keys(res).map( (r)  => { 
      return res[r]; 
    })
    const expirationData = new Date(new Date().getTime() + +values[2] * 1000);
    const logUser = new User(values[3], values[0], values[1], expirationData );
    
    this.user.next(logUser);
    //this.autoLogOut(values[2] * 1000);

     localStorage.setItem('userData', JSON.stringify(res));
  }

  logout(): boolean{
    this.user.next(null);
    localStorage.removeItem('userData');
    if(localStorage.length != 0){
      return false;
    }  
    return true;
   /*  if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    } 
    this.tokenExpirationTimer = null;
    */

  }

  /* autoLogin(){
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if(!userData){
      return;
    }

    const loadedUser = new User(userData.email,userData.id,userData.token, new Date(userData.expiration));
  
    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration =new Date(userData.expiration).getTime() - new Date().getTime();
      this.autoLogOut(expirationDuration);
    }
  }



  autoLogOut(expirationDuration: number){
   this.tokenExpirationTimer = setTimeout(()=> {
      this.logout();
    }, expirationDuration)
} */

public getUser(id: number): Observable<User> {
  return this.http.get<User>(this.api + "userId/" +id).pipe(
    catchError(this.handlerError));
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





