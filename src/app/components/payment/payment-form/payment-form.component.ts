import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { Payment } from 'src/app/models/payment';
import { ReceiptService } from 'src/app/services/receipt/receipt.service';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
    private receiptService: ReceiptService
  ) {}

  payment: Payment;
  editPaymentId: number;
  receiptId: number;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
    
      this.editPaymentId = +params["paymentid"];
      this.route.parent.params.subscribe((p: Params) => {
        this.receiptId=+p["receiptid"];
      })
      this.createForm(null, null);
      if (this.editPaymentId) {
        this.initForm();
      }
    });
  }

  initForm() {
  
    let amount = null;
    let date = null;

    this.paymentService.getPayment(this.editPaymentId).subscribe(
      (data) => {
        date = data.date_of_issue;
        amount = data.amount;
      
        this.createForm(date, amount);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(date,amount) {
    this.paymentForm = new FormGroup({
      date: new FormControl(date, Validators.required),
      amount: new FormControl(amount, [
        Validators.required
      ])
    });
  }

  createEditPayment() {
    let newPayment =this.paymentForm.value;
    this.receiptService.getReceipt(this.receiptId).subscribe(r => {
    const receipt = {receipt: r};
    newPayment= {...newPayment, ...receipt};

    const momentDate = new Date(newPayment.date_of_issue);
    const formattedDate = moment(momentDate).format("MM/DD/YYYY");
    newPayment.date_of_issue = formattedDate;

    if (this.editPaymentId) {
      const id = {paymentId: this.editPaymentId};
      newPayment = {...id, ...newPayment};
      this.paymentService
        .updatePayment(newPayment)
        .subscribe(
          (data) => {
            this.redirectTo();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.paymentService.createPayment(newPayment).subscribe(
        (data) => {
        
          this.redirectTo();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  })
  }



  redirectTo() {
    this.paymentService.paymentEmitter.emit(this.editPaymentId);
    if(this.editPaymentId){
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
    this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

}
