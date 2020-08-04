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


@Component({
  selector: "app-receipt-last-year",
  styleUrls: ["receipt_last_year.component.css"],
  templateUrl: "receipt_last_year.component.html",
})
export class ReceiptLastYearComponent implements OnInit {
  displayedColumns = [
    "receiptId",
    "date_of_issue",
    "time_limit",
    "total_amount",
    "debt",
  ];
  dataSource: MatTableDataSource<Receipt>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  clientId: number;
  clientName: String;
  reportType: String;
  @ViewChild('htmlData') htmlData:ElementRef;

  private receipts: Receipt[];

  constructor(
    private receiptService: ReceiptService,
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
        (error) => {}
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
        (error) => {}
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
            (error) => {}
          );
      });
    }
  }

  getTotal() {
    if (this.receipts) {
      return this.receipts
        .map((t) => t.total_amount)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  public openPDF():void {
    let DATA = this.htmlData.nativeElement;
    let doc = new jsPDF('p','pt', 'a4');
    doc.fromHTML(DATA.innerHTML,15,15);
    doc.output('dataurlnewwindow');
  }


  public downloadPDF():void {
    let DATA = this.htmlData.nativeElement;
    let doc = new jsPDF('p','pt', 'a4');

    let handleElement = {
      '#editor':function(element,renderer){
        return true;
      }
    };
    doc.fromHTML(DATA.innerHTML,15,15,{
      'width': 200,
      'elementHandlers': handleElement
    });

    doc.save('angular-demo.pdf');
  }
}
