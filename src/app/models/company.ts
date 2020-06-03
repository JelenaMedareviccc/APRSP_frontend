import { Client } from './client';

export class Company {
    companyId: number;
    name : string;
    pib : string;
    address : string;
    contact : string;
    email : string;
    account_number : string;
    clients: Client[];
    private _token: string;
    private _tokenExpirationDate: Date;

    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
}
