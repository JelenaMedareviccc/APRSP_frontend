import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  public showReceiptTable : boolean;
  public editId: Number;


  constructor() {
    this.showReceiptTable=true;
   }

  ngOnInit() {
  }

  addNewReceipt(){
    this.showReceiptTable = false;
  }

  isViewableOutForm($event){
  
    this.showReceiptTable=true;
    this.editId=null;
  }

  editForm($event){
    this.showReceiptTable=false;
    this.editId =$event;
  }

}
