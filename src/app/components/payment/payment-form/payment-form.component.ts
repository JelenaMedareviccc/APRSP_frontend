import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { Payment } from 'src/app/models/payment';

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
    private router: Router
  ) {}

  payment: Payment;
  editPaymentId: number;
  receiptId: number;
  editMode: boolean = false;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.receiptId=+params["receiptid"];
      this.editPaymentId = +params["paymentid"];
      this.editMode = params["paymentid"] != null;
      this.createForm(null, null);
      if (this.editMode) {
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
        Validators.required,
        Validators.minLength(0),
      ])
    });
  }

  createEditPayment() {
    let newPayment =this.paymentForm.value;
    const receipt = {receipt: this.receiptId};
    newPayment= {...newPayment, ...receipt};


    if (this.editPaymentId) {
      this.paymentService
        .updatePayment(
          new Payment(
            this.editPaymentId,
            newPayment.date_of_issue,
            newPayment.amount,
            newPayment.receipt

          )
        )
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
  }



  redirectTo() {
    this.paymentService.paymentEmitter.emit(this.editMode);
    this.router.navigate(["../"], { relativeTo: this.route });
  }

}
