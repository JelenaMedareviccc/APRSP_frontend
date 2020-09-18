import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DialogComponent } from "../../dialog/dialog.component";
import { Payment } from "src/app/models/payment";
import { PaymentService } from "src/app/services/payment/payment.service";
import { ClientService } from 'src/app/services/client/client.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { Company } from 'src/app/models/company';
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { PdfMakerService } from 'src/app/services/pdfMaker/pdf-maker.service';

@Component({
  selector: "app-payment-table",
  templateUrl: "./payment-table.component.html",
  styleUrls: ["./payment-table.component.css"],
})
export class PaymentTableComponent implements OnInit {
  displayedColumns = ["paymentId", "amount", "dateOfIssue", "delete", "edit"];
  dataSource: MatTableDataSource<Payment>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  receiptId: number;
  showButtons: boolean = false;
  private payments: Payment[] = [];
  title: string;
  companyId: number;
  clientId: number;
  currencyType: string;
  showFooter: boolean = true;
  showEditDelete: boolean= true;
  showPayments: boolean = false;
  companyName: string;


  constructor(
    private paymentService: PaymentService,
    private companyService: CompanyService,
    private pdfMakerService: PdfMakerService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   this.fetchData();
  }

  fetchData() {
    if(this.router.url.includes('/payment/all')){
      let userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData["id"];
      const username = userData["username"];
      this.companyName=username;
      this.title=username + 's payments';
      this.showFooter = false;

      this.paymentService.getPaymentByUser(userId).subscribe(payments => {
        this.payments = payments;
        this.initializeDataSource();
        this.showButtons = false;
        this.showEditDelete = true;
      }, error => {
        console.log(error);
      })

    } else if (this.router.url.includes('paymentsForLast365Days')){
      this.route.params.subscribe((params: Params) => {
        this.companyId = +params["companyid"];
       
        this.companyService.getCompany(this.companyId).subscribe((company: Company) => {
          this.title= company.name + "'s payments";
          this.companyName= company.name;

          this.paymentService.getPaymentByCompanyFor365(this.companyId).subscribe(payments => {
            this.payments = payments;
            this.initializeDataSource();
            this.showButtons = false;
            this.showEditDelete = false;
            this.showFooter=true;
          }, error => {
            console.log(error);
          })

        }, error => {
          console.log(error);
        })
        
      })


    
    }
    else {
      this.route.parent.params.subscribe((params: Params) => {
        this.receiptId = +params["receiptid"];
        this.companyId = +params["companyid"];
        this.clientId = +params["clientid"];
      });

      this.companyService.getCompany(this.companyId).subscribe(company => {
        this.currencyType=company.currency;
        this.companyName=company.name;
      })
    this.paymentService.getPaymentByReceipt(this.receiptId).subscribe(
      (payments) => {
        this.payments = payments;
        this.initializeDataSource();
        this.showButtons = true;
        this.showEditDelete = true;
        this.showFooter=true;
        this.title = "Payments for receipt with id "+this.receiptId;
        

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

    if(this.payments){
      this.showPayments=true;
    }

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

  openDialog(actionType: string): any{
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType },
    });
    return dialogRef;
  }

  public openPDF(): void {
    let doc = new jsPDF();

    

    this.pdfMakerService.pdfMaker(doc, this.title, this.companyName, "#myPaymentTable")
    

    doc.output("dataurlnewwindow", "Report");
  }

  public downloadPDF(): void {
    let doc = new jsPDF();
    //this.pdfMaker(doc);
    this.pdfMakerService.pdfMaker(doc,  this.title, this.companyName, "#myPaymentTable")

    doc.save("report.pdf");
  }


}
