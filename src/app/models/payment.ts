import { Receipt } from './receipt';

export class Payment {
    paymentId: number;
    amount : number;
    date_of_issue : Date;
    receipt: Receipt;

    constructor(paymentId:number, amount:number,date_of_issue: Date, receipt: Receipt){
        this.paymentId=paymentId;
        this.amount=amount;
        this.date_of_issue=date_of_issue;
        this.receipt=receipt;
    }
}