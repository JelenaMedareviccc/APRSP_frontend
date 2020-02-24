import { Company } from './company';
import { Receipt } from './receipt';

export class Client {
    clientId: number;
    name : string;
    client_reg_number : string;
    address : string;
    contact : string;
    email : string;
    account_number : string;
    company: Company;
    receipts: Receipt[];
}