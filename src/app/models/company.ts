import { User } from "./user";

export class Company {
  companyId: number;
  name: string;
  pib: string;
  address: string;
  contact: string;
  email: string;
  accountNumber: string;
  authuser: User;
  currency: string;


  constructor(companyId: number, name: string, pib: string, address: string, contact: string, email: string, accountNumber: string, currency: string) {
    this.companyId = companyId;
    this.name = name;
    this.pib = pib;
    this.address = address;
    this.contact = contact;
    this.email = email;
    this.accountNumber = accountNumber;
    this.currency = currency;
  }
}
