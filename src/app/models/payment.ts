import { Receipt } from './receipt';

export class Payment {
    paymentId: number;
    amount : number;
    date_of_issue : Date;
    receipt: Receipt;
}