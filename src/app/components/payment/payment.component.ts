import { Component, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/services/payment/payment.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar, private paymentService: PaymentService) { }
  
  ngOnInit() {

    this.paymentService.paymentEmitter.subscribe(res =>{
      if(res){
        let snackBarRef = this._snackBar.open("Payment succesfully updated!", "OK");
      } else {
        let snackBarRef = this._snackBar.open("Payment succesfully created!", "OK");
      }

    })
  }



}
