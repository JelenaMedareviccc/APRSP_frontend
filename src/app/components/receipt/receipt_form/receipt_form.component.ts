import { Component, OnInit, Input, Inject } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ReceiptService } from 'src/app/services/receipt/receipt.service';
import { Receipt } from 'src/app/models/receipt';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt_form.component.html',
  styleUrls: ['./receipt_form.component.css']
})

export class ReceiptFormComponent implements OnInit {

  constructor(private receiptService: ReceiptService) { }

  @Input() receipt : Receipt;

  ngOnInit() {

  }

  createReceipt(f: NgForm) {
    this.receipt = f.value;
    this.receiptService.createReceipt(this.receipt).subscribe(data => {
      // refresh the list

      return true;
    },
    error => {
      console.log(error);
     });
  }



}
