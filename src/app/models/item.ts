import { Measure } from './measure-enum';
import { Receipt } from './receipt';

export class Item {
    itemId: number;
    name : string;
    price : number;
    measure : Measure;
    receipt: Receipt;
}