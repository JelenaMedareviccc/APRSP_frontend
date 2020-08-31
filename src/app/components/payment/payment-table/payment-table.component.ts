import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DialogComponent } from "../../dialog/dialog.component";
import { Payment } from "src/app/models/payment";
import { PaymentService } from "src/app/services/payment/payment.service";
import { ReceiptService } from 'src/app/services/receipt/receipt.service';

@Component({
  selector: "app-payment-table",
  templateUrl: "./payment-table.component.html",
  styleUrls: ["./payment-table.component.css"],
})
export class PaymentTableComponent implements OnInit {
  displayedColumns = ["paymentId", "amount", "date_of_issue", "delete", "edit"];
  dataSource: MatTableDataSource<Payment>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  receiptId: number;
  showButtons: boolean = true;
  private payments: Payment[] = [];
  title: String;
  companyId: number;
  clientId: number;

  constructor(
    private paymentService: PaymentService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   this.fetchData();
   this.initializeDataSource();
  }
  
  fetchData() {
    if(this.router.url.includes('/payment/all')){
      let userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData["id"];
      const username = userData["username"];
      this.title=username;
      this.paymentService.getPaymentByUser(userId).subscribe(payments => {
        this.payments = payments;
        this.initializeDataSource();
        this.showButtons = false;
      }, error => {
        console.log(error);
      })

    } else {
      this.route.parent.params.subscribe((params: Params) => {
        this.receiptId = +params["receiptid"];
        this.companyId = +params["companyid"];
        this.clientId = +params["clientid"];
      });
  
    this.paymentService.getPaymentByReceipt(this.receiptId).subscribe(
      (payments) => {
        this.payments = payments;
        this.initializeDataSource();
        this.showButtons = true;
        
      },
      (error) => {
        console.log(error);
      }
    );
    }
  }

  initializeDataSource(){
    this.dataSource = new MatTableDataSource<Payment>(this.payments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  deletePayment(id: number) {
    const dialogRef = this.openDialog("delete");

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result: " + result);
      if (!result) {
        return;
      }
      this.paymentService.deletePayment(id).subscribe(
        () => {
          this.fetchData();
        },
        () => {
          this.openDialog("deleteError")
        }
      );
    });
  }

  addNewPayment() {
    this.router.navigate(["newPayment"], { relativeTo: this.route });
  }

  editPayment(paymentid: number) {
    if(this.router.url.includes('/payment/all')){
      this.paymentService.getPayment(paymentid).subscribe(payment => {
        this.receiptId= payment.receipt.receiptId;
        this.clientId=payment.receipt.client.clientId;
        this.companyId =payment.receipt.client.company.companyId;
        this.router.navigate([`../../company/${this.companyId}/client/${this.clientId}/receipts/${this.receiptId}/payments/${paymentid}/edit`], { relativeTo: this.route });

      })
    } else {
      this.router.navigate([`${paymentid}/edit`], { relativeTo: this.route });
    }

    
  }

  getTotalCost() {
    if (this.payments) {
      return this.payments
        .map((p) => p.amount)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  backToReceipts() {
    this.router.navigate(["company/" + this.companyId + "/client/" + this.clientId + "/receipts"]);
  }

  openDialog(actionType: String): any{
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType },
    });
    return dialogRef;
  }


}
