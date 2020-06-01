import { Measure } from './measure-enum';

export class Item {
    itemId: number;
    name: string;
    price: number;
    measure: Measure;
    receiptId: number;

    constructor(itemId:number, name:string, price:number, measure:Measure, receiptId: number){
        this.itemId=itemId;
        this.name=name;
        this.price=price;
        this.measure=measure;
        this.receiptId=receiptId;
    }
}
