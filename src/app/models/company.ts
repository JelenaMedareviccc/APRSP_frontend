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
}