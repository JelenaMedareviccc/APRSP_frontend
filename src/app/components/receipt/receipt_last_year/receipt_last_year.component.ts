import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Receipt } from "src/app/models/receipt";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ClientService } from "src/app/services/client/client.service";
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CompanyService } from 'src/app/services/company/company.service';
import { timestamp } from 'rxjs/operators';


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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  clientId: number;
  clientName: string;
  companyName: string;
  reportType: string;

  private receipts: Receipt[];

  constructor(
    private receiptService: ReceiptService,
    private companyService: CompanyService,
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
      this.companyService.getCompany(companyid).subscribe(company => {
        this.companyName = company.name;

      })

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
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.reportType =
                  "between " + startDate + " and " + endDate + "!";
              }
            },
            (error) => {
              console.log(error);
            }
          );
      });
    } else if (this.router.url.includes("filteredReceiptsForSelectedYear")){
      this.route.queryParams.subscribe((params: Params) => {
        const year = params["year"]
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
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.reportType =
                  "for" + year + " year!";
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

  public openPDF():void {

   let doc = new jsPDF();
  this.pdfMaker(doc);


    doc.output('dataurlnewwindow', "Report");
  }


  public downloadPDF():void {
    let doc = new jsPDF();
    this.pdfMaker(doc);



    doc.save('report.pdf');
  }

  private pdfMaker(doc: jsPDF){
    doc.setProperties({
      title: 'Report',
      subject: 'Receipt report' + this.reportType,
      author: this.clientName
    });
    doc.setFontSize(10);

    doc.page=1; // use this as a counter.

    let footer = function footer(){
      let pageCount = doc.internal.getNumberOfPages();
      for(let i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.text(100, 285, "Page: " + doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);
      }
};

const client = this.clientName;
const report = this.reportType;
let companyName= this.companyName;



const header = function(headerData: any) {
  doc.setFontSize(20);

  doc.setFontStyle('normal');

 doc.text("REPORT ",headerData.settings.margin.left+ 70, 15 )

doc.setFontSize(15);
 doc.text("Receipts " + report,headerData.settings.margin.left+ 55, 25  )
 doc.setFontSize(10);
  doc.text("Client: " + client, headerData.settings.margin.left, 40);
  doc.text("Company: " + companyName, headerData.settings.margin.left,50)
  let datetime = new Date();

 const date =datetime.getDay() + '/' + (datetime.getMonth() + 1) + '/' + datetime.getFullYear();
  doc.text('Date: ' + date.toString(), headerData.settings.margin.left, 60);
  const time = datetime.getHours() + ':'+datetime.getMinutes()+':'+ datetime.getSeconds();
  doc.text('Time ' + time.toString(), headerData.settings.margin.left, 70)

};

  doc.autoTable({html:"#myTable",
  pageBreak: 'auto',

            margin: {
              top: 80
            },
            fontName: "times",
  didDrawPage: header,

    paperSize: {
        format: 'A4',
        orientation: 'portrait',
        border: '1.8cm'
    },




});
doc.autoTable({
  didDrawPage: footer
})
  }
}
