import { Payment } from './payment';
import { Item } from './item';
import { Client } from './client';


export class Receipt {
    receiptId: number;
    date_of_issue : Date;
    time_limit : number;
    total_amount : number;
    dept: number;
    client: Client;

    constructor (date_of_issue: Date, time_limit: number, dept: number, client: Client){
        
        this.date_of_issue=date_of_issue;
        this.time_limit=time_limit;
        this.dept=dept;
        this.client=client;
     
    }




}
