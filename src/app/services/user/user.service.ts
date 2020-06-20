import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as config from '../../config/config.json';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.js';




@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = config.apiUrl + '/user/';

  user : BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  users : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  constructor(private http : HttpClient) { }

  signUp(userRegistration : User){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let options = { headers: headers};
    console.log(userRegistration);
    return this.http.post(
      this.api+'signup',
      userRegistration,
      options
    ); 
  }

  login(username : string, password : string){

    localStorage.setItem('token', '');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');    
  
    let params = new HttpParams().set("username",username).set("password", password); //Create new HttpParams
   
    let options = { headers: headers};

    return this.http.post(
      this.api+'signin?' + params,
      options
    ); 
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
