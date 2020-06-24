import { Role } from './role';


export class User {
    userId: number;
    first_name : string;
    last_name : string;
    username : string;
    email : string;
    password: string;
    role: Role;
    token: string;
    tokenExpirationDate: Date;
    expiration: number;

 
    constructor(userId, username, token, expiration){
 
      this.username=username;
    this.token=token;
    this.userId=userId;
    this.expiration=expiration;
   // this.tokenExpirationDate=tokenExpirationDate;

    } 

    get _token(){
      if(!this.tokenExpirationDate || new Date()> this.tokenExpirationDate){
        return null;
      }
      return this.token;
    }
}
