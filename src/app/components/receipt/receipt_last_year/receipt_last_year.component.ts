import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Receipt } from "src/app/models/receipt";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ClientService } from "src/app/services/client/client.service";

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
    "dept",
  ];
  dataSource: MatTableDataSource<Receipt>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  showText: boolean;
  clientId: number;
  clientName: String;

  private receipts: Receipt[];

  constructor(
    private receiptService: ReceiptService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {
    this.showText = false;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.clientId = +params["clientid"];
      this.initializeDataSource();
      this.clientService.getClient(this.clientId).subscribe((data) => {
        this.clientName = data.name;
      });
    });
    console.log(this.clientId);
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
          }
        },
        (error) => {}
      );
    }  else if (this.router.url.includes("filteredReceiptsBetweenTwoDates")) {
      this.route.queryParams.subscribe((params: Params) => {
        const startDate = params["startDate"];
        const endDate = params["endDate"];

        this.receiptService.getReceiptsBetweenTwoDates(this.clientId, startDate, endDate).subscribe(
          (receipts) => {
            if (receipts) {
              this.receipts = receipts;
              this.dataSource = new MatTableDataSource<Receipt>(this.receipts);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          },
          (error) => {}
        );

      }) 
     
    }
  }

  getTotal() {
    if (this.receipts) {
      return this.receipts
        .map((t) => t.total_amount)
        .reduce((acc, value) => acc + value, 0);
    }
  }
}
