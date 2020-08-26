import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { PaymentService } from "src/app/services/payment/payment.service";
import { Payment } from "src/app/models/payment";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import * as moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: "app-payment-form",
  templateUrl: "./payment-form.component.html",
  styleUrls: ["./payment-form.component.css"],
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
    private receiptService: ReceiptService,
    public dialog: MatDialog
  ) {}

  newPayment: Payment;
  editPaymentId: number;
  receiptId: number;
  date;
  formText: string;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.editPaymentId = +params["paymentid"];
      this.formText = "Add new payment";
      this.route.parent.params.subscribe((p: Params) => {
        this.receiptId = +p["receiptid"];
      });
      this.createForm(null, null);
      if (this.editPaymentId) {
        this.initForm();
        this.formText = "Edit payment";
      }
    });
  }

  initForm() {
    let amount = null;
    this.paymentService.getPayment(this.editPaymentId).subscribe(
      (data) => {
        this.date = data.date_of_issue;
        amount = data.amount;
        this.createForm(this.date, amount);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(date, amount) {
    this.paymentForm = new FormGroup({
      date_of_issue: new FormControl(date, Validators.required),
      amount: new FormControl(amount, [Validators.required]),
    });
  }

  createEditPayment() {
    this.newPayment = this.paymentForm.value;
    this.receiptService.getReceipt(this.receiptId).subscribe((r) => {
      const receipt = { receipt: r };
      this.newPayment = { ...this.newPayment, ...receipt };
      console.log("Datum: " + this.newPayment.date_of_issue);
      const momentDate = new Date(this.newPayment.date_of_issue);
      const formattedDate = moment(momentDate).format("MM/DD/YYYY");
      this.newPayment.date_of_issue = formattedDate;
      if (this.editPaymentId) {
        const id = { paymentId: this.editPaymentId };
        this.newPayment = { ...id, ...this.newPayment };
        this.paymentService.updatePayment(this.newPayment).subscribe(
          () => {
            this.redirectTo();
          },
          () => {
            this.openDialog("error");
          }
        );
      } else {
        this.paymentService.createPayment(this.newPayment).subscribe(
          () => {
            this.redirectTo();
          },
          () => {
            this.openDialog("error");
          }
        );
      }
    });
  }

  redirectTo() {
    this.paymentService.paymentEmitter.emit(this.editPaymentId);
    if (this.editPaymentId) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  openDialog(actionType){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      
    });
  }
}
