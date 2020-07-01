import { ClientService } from "./../../../services/client/client.service";
import { Receipt } from "./../../../models/receipt";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-receipt-table",
  templateUrl: "./receipt_table.component.html",
  styleUrls: ["./receipt_table.component.css"],
})
export class ReceiptTableComponent implements OnInit {
  displayedColumns = [
    "receiptId",
    "date_of_issue",
    "time_limit",
    "total_amount",
    "dept",
    "payment",
    "delete",
    "edit",
    "items",
  ];
  dataSource: MatTableDataSource<Receipt>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  clientId: number;
  clientName: String;
  dateForm: FormGroup;
  showBetweenFilter: boolean;

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
      this.showBetweenFilter = false;
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
    this.dateForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    });
    this.receiptService.getReceiptByClient(this.clientId).subscribe(
      (receipts) => {
        if(receipts){
        this.receipts = receipts;
        this.dataSource = new MatTableDataSource<Receipt>(this.receipts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }
      },
      (error) => {}
    );
  }

  deleteReceipt(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result: " + result);
      if (!result) {
        return;
      }
      this.receiptService.deleteReceipt(id).subscribe(
        (res) => {
          this.initializeDataSource();
        },
        (error) => {}
      );
    });
  }

  addNewReceipt() {
    this.router.navigate(["newReceipt"], { relativeTo: this.route });
  }

  editReceipt(receiptid: number) {
    this.router.navigate([`${receiptid}/edit`], { relativeTo: this.route });
  }

  viewPayment(receiptid: number) {
    this.router.navigate([`${receiptid}/payments`], { relativeTo: this.route });
  }

  showItems(receiptid: number) {
    this.router.navigate([`${receiptid}/items`], { relativeTo: this.route });
  }

  getTotalCost() {
    if (this.receipts) {
      return this.receipts
        .map((r) => r.total_amount)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  getTotalDebt() {
    if (this.receipts) {
      return this.receipts
        .map((r) => r.dept)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  onShowLastYearReceipts() {
    this.router.navigate(["filteredReceiptsLastYear"], {
      relativeTo: this.route,
    });
  }

  onShowLast365DaysReceipts() {
    this.router.navigate(["filteredReceiptsLast365Days"], {
      relativeTo: this.route,
    });
  }

  filterReceipts() {
    console.log(this.dateForm.value);
    const start = new Date(this.dateForm.value.startDate);
    const startDate = moment(start).format("MM/DD/YYYY");
    const end = new Date(this.dateForm.value.startDate);
    const endDate = moment(end).format("MM/DD/YYYY");
    this.router.navigate(["filteredReceiptsBetweenTwoDates"], {
      relativeTo: this.route,
      queryParams: { startDate: startDate, endDate: endDate },
    });
  }

  onShowBetweenTwoDates() {
    this.showBetweenFilter = !this.showBetweenFilter;
  }
}
