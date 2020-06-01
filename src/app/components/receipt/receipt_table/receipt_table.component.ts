import { Receipt } from "./../../../models/receipt";
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Client } from "src/app/models/client";
import { MatPaginator } from "@angular/material/paginator";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSort } from '@angular/material/sort';



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
  ];
  dataSource: MatTableDataSource<Receipt>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  showText: boolean;



  private receipts: Receipt[];

  constructor(
    private receiptService: ReceiptService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.showText=false;
  }

  ngOnInit(): void {
    this.initializeDataSource();

  }

  showTextChange(show: boolean){
    this.showText=show;

  }

  selected(receipt: Receipt) {
    this.router.navigate([`${receipt.receiptId}:/items`], { relativeTo: this.route });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  initializeDataSource() {
    this.receiptService.getReceipts().subscribe(
      (receipts) => {
        this.receipts = receipts;
        this.dataSource = new MatTableDataSource<Receipt>(this.receipts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

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
    this.router.navigate([`${receiptid}`], { relativeTo: this.route });
  }

  viewPayment(receiptid: number){
    this.router.navigate([`${receiptid} /payments`], { relativeTo: this.route });

  }
}
