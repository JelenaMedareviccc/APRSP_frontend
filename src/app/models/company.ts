
import { User } from './user';

export class Company {
    companyId: number;
    name : string;
    pib : string;
    address : string;
    contact : string;
    email : string;
    account_number : string;
    authuser: User;
  

    constructor(companyId, name, pib, address, contact, email, account_number){
      this.companyId=companyId;
      this.name=name;
      this.pib=pib;
      this.address=address;
      this.contact=contact;
      this.email=email;
      this.account_number=account_number;
     

  }

 
}

