import { Payment } from './payment';
import { Item } from './item';


export class Receipt {
    receiptId: number;
    date_of_issue : Date;
    time_limit : number;
    total_amount : number;
    dept: number;
    items: Item[];

    constructor (receiptId: number,date_of_issue: Date, time_limit: number, total_amount: number, dept: number, items: Item[] ){
        this.receiptId= receiptId;
        this.date_of_issue=date_of_issue;
        this.time_limit=time_limit;
        this.total_amount=total_amount;
        this.dept=dept;
        this.items=items;
    }



}
