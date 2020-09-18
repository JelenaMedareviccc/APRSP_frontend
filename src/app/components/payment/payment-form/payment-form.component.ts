import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { PaymentService } from "src/app/services/payment/payment.service";
import { Payment } from "src/app/models/payment";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import * as moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { formatDate } from '@angular/common';
import { CompanyService } from 'src/app/services/company/company.service';

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
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private companyService: CompanyService
  ) {}

  newPayment: Payment;
  editPaymentId: number;
  receiptId: number;
  dateOfIssue: any;
  formText: string;
  today = new Date();
  companyId: number;
  currency: string;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.editPaymentId = +params["paymentid"];
      this.formText = "New payment";
      this.route.parent.params.subscribe((p: Params) => {
        this.receiptId = +p["receiptid"];
        this.companyId = +p["companyid"];
        this.companyService.getCompany(this.companyId).subscribe(company => {
          this.currency = company.currency;
        })
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
        this.dateOfIssue = data.dateOfIssue;
        amount = data.amount;
        this.createForm(this.dateOfIssue, amount);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(dateOfIssue: any, amount: number) {
    this.paymentForm  = this.formBuilder.group({
      dateOfIssue: [formatDate(dateOfIssue, 'MM/DD/YYYY', 'en'), [Validators.required]],
      amount: new FormControl(amount, Validators.required)

    });
    this.dateOfIssue=dateOfIssue;

  }

  createEditPayment() {
    this.newPayment = this.paymentForm.value;
    this.receiptService.getReceipt(this.receiptId).subscribe((r) => {

      const momentDateReceipt = new Date(r.dateOfIssue);
      const formattedDateReceipt = moment(momentDateReceipt).format("MM/DD/YYYY");
      r.dateOfIssue = formattedDateReceipt;
      const receipt = { receipt: r };
      this.newPayment = { ...this.newPayment, ...receipt };
      console.log("Datum: " + this.newPayment.dateOfIssue);
      const momentDate = new Date(this.newPayment.dateOfIssue);
    const formattedDate = moment(momentDate).format("MM/DD/YYYY");
    this.newPayment.dateOfIssue = formattedDate;
    console.log(this.newPayment.dateOfIssue);
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

  openDialog(actionType: string){
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
