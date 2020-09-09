import { Company } from "./company";

export class Client {
  clientId: number;
  name: string;
  clientRegNumber: string;
  address: string;
  contact: string;
  email: string;
  accountNumber: string;
  company: Company;

  constructor(
    clientId: number,
    name: string,
    clientRegNumber: string,
    address: string,
    contact: string,
    email: string,
    accountNumber: string,
    company: Company
  ) {
    this.clientId = clientId;
    this.name = name;
    this.clientRegNumber = clientRegNumber;
    this.address = address;
    this.contact = contact;
    this.email = email;
    this.accountNumber = accountNumber;
    this.company = company;
  }
}
