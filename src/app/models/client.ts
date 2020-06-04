import { Company } from './company';
import { Receipt } from './receipt';

export class Client {
    clientId: number;
    name : string;
    client_reg_number : string;
    address : string;
    contact : string;
    email : string;
    account_number: string;
    company: number;

    constructor(clientId, name, client_reg_number, address, contact, email, account_number, company){
        this.clientId=clientId;
        this.name=name;
        this.client_reg_number=client_reg_number;
        this.address=address;
        this.contact=contact;
        this.email=email;
        this.account_number=account_number;
        this.company=company;

    }
}
