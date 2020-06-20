import { Role } from './role';


export class User {
    userId: number;
    firstName : string;
    lastName : string;
    username : string;
    email : string;
    password: string;
    role: Role;

    constructor(){

    }

   /*  constructor(userId, fisrtName, lastName, username, email, password, role){
      this.userId = userId;
      this.firstName= fisrtName;
      this.lastName=lastName;
      this.username=username;
      this.email=email;
      this.password=password;
      this.role=role;
        

    } */
}
