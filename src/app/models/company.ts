import { Client } from './client';

export class Company {
    companyId: number;
    name : string;
    pib : string;
    address : string;
    contact : string;
    email : string;
    account_number : string;
   // password: string;
    private _token: string;
    private _tokenExpirationDate: Date;

    constructor(companyId, name, pib, address, contact, email, account_number){
      this.companyId=companyId;
      this.name=name;
      this.pib=pib;
      this.address=address;
      this.contact=contact;
      this.email=email;
      this.account_number=account_number;
    //  this.password=password;

  }

    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
}
