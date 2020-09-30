import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Receipt } from "src/app/models/receipt";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ClientService } from "src/app/services/client/client.service";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { CompanyService } from "src/app/services/company/company.service";
import { PdfMakerService } from "src/app/services/pdfMaker/pdf-maker.service";

@Component({
  selector: "app-receipt-last-year",
  styleUrls: ["receipt_last_year.component.css"],
  templateUrl: "receipt_last_year.component.html",
})
export class ReceiptLastYearComponent implements OnInit {
  displayedColumns = [
    "receiptId",
    "dateOfIssue",
    "timeLimit",
    "totalAmount",
    "debt",
  ];
  dataSource: MatTableDataSource<Receipt>;

  @ViewChild(MatSort, { static: false })
  set sort(v: MatSort) {
    this.dataSource.sort = v;
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }
  clientId: number;
  clientName: string;
  companyName: string;
  reportType: string;

  private receipts: Receipt[];

  constructor(
    private receiptService: ReceiptService,
    private companyService: CompanyService,
    private pdfMakerService: PdfMakerService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.clientId = +params["clientid"];
      this.initializeDataSource();
      this.clientService.getClient(this.clientId).subscribe((data) => {
        this.clientName = data.name;
      });
    });

    this.route.parent.params.subscribe((params: Params) => {
      const companyid = +params["companyid"];
      this.companyService.getCompany(companyid).subscribe((company) => {
        this.companyName = company.name;
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  initializeDataSource() {
    if (this.router.url.includes("filteredReceiptsLastYear")) {
      this.receiptService.getLastYearReceipts(this.clientId).subscribe(
        (receipts) => {
          if (receipts) {
            this.receipts = receipts;
            this.dataSource = new MatTableDataSource<Receipt>(this.receipts);

            this.reportType = "for last year!";
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.router.url.includes("filteredReceiptsLast365Days")) {
      this.receiptService.getLast365DaysReceipts(this.clientId).subscribe(
        (receipts) => {
          if (receipts) {
            this.receipts = receipts;
            this.dataSource = new MatTableDataSource<Receipt>(this.receipts);
            this.reportType = "for last 365 days!";
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.router.url.includes("filteredReceiptsBetweenTwoDates")) {
      this.route.queryParams.subscribe((params: Params) => {
        const startDate = params["startDate"];
        const endDate = params["endDate"];
        this.receiptService
          .getReceiptsBetweenTwoDates(this.clientId, startDate, endDate)
          .subscribe(
            (receipts) => {
              if (receipts) {
                this.receipts = receipts;
                this.dataSource = new MatTableDataSource<Receipt>(
                  this.receipts
                );
                this.reportType =
                  "between " + startDate + " and " + endDate + "!";
              }
            },
            (error) => {
              console.log(error);
            }
          );
      });
    } else if (this.router.url.includes("filteredReceiptsForSelectedYear")) {
      this.route.queryParams.subscribe((params: Params) => {
        const year = params["year"];
        this.receiptService
          .getReceiptsForSelectedYear(this.clientId, year)
          .subscribe(
            (receipts) => {
              console.log(receipts);
              if (receipts) {
                this.receipts = receipts;
                this.dataSource = new MatTableDataSource<Receipt>(
                  this.receipts
                );
                this.reportType = "for " + year + " year!";
              }
            },
            (error) => {
              console.log(error);
            }
          );
      });
    }
  }

  getTotal() {
    if (this.receipts) {
      return this.receipts
        .map((t) => t.totalAmount)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  getTotalDebt() {
    if (this.receipts) {
      return this.receipts
        .map((r) => r.debt)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  public openPDF(): void {
    let doc = new jsPDF();

    this.pdfMakerService.pdfMaker(
      doc,
      this.reportType,
      this.companyName,
      "#myReceiptTable",
      this.clientName
    );
    //this.pdfMaker(doc);

    doc.output("dataurlnewwindow", "Report");
  }

  public downloadPDF(): void {
    let doc = new jsPDF();
    //this.pdfMaker(doc);
    this.pdfMakerService.pdfMaker(
      doc,
      this.reportType,
      this.companyName,
      "#myReceiptTable",
      this.clientName
    );

    doc.save("report.pdf");
  }
}
