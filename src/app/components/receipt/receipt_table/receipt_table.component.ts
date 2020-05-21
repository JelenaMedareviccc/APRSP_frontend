
import { Receipt } from './../../../models/receipt';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/app/models/client';
import { MatPaginator } from '@angular/material/paginator';
import { ReceiptService } from 'src/app/services/receipt/receipt.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';


@Component({
  selector: 'app-receipt-table',
  templateUrl: './receipt_table.component.html',
  styleUrls: ['./receipt_table.component.css']
})
export class ReceiptTableComponent implements OnInit {

  displayedColumns = ['receiptId', 'date_of_issue', 'time_limit', 'total_amount', 'dept', 'delete', 'edit' ];
  dataSource: MatTableDataSource<Receipt>;
  @Output() showReceiptForm = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private receipts: Receipt[];


  constructor( private receiptService : ReceiptService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeDataSource();
  }

  initializeDataSource() {
    this.receiptService.getReceipts().subscribe(receipts => {
      this.receipts = receipts;
      this.dataSource = new MatTableDataSource<Receipt>(this.receipts);
      this.dataSource.paginator = this.paginator;
    } , error => {});
  }

  deleteReceipt(id : number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result: " + result)
      if (!result) {
        return;
      }
      this.receiptService.deleteReceipt(id).subscribe( res => {
        this.initializeDataSource();
      }, error => {});
    });
  }

  editReceipt(id: number){

    this.showReceiptForm.emit(id);

  }

}
