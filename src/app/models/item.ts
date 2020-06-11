import { Measure } from './measure-enum';
import { Receipt } from './receipt';

export class Item {
    itemId: number;
    name: string;
    price: number;
    measure: number;
    totalPrice: number;
    receipt: Receipt;

    constructor(itemId:number, name:string, price:number, measure:number, receipt: Receipt){
        this.itemId=itemId;
        this.name=name;
        this.price=price;
        this.measure=measure;
        this.receipt=receipt;
    }
}
