import { Receipt } from './receipt';

export class Payment {
    paymentId: number;
    amount : number;
    date_of_issue : Date;
    receiptId: number;

    constructor(paymentId:number, amount:number,date_of_issue: Date, receiptId: number){
        this.paymentId=paymentId;
        this.amount=amount;
        this.date_of_issue=date_of_issue;
        this.receiptId=receiptId;
    }
}