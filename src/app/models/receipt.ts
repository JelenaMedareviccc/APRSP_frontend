import { Payment } from './payment';
import { Item } from './item';

export class Receipt {
    receiptId: number;
    date_of_issue : Date;
    time_limit : number;
    total_amount : number;
    dept: number;
}
