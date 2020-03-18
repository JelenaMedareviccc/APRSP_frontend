import { ReceiptService } from './../../services/receipt/receipt.service';
import { Receipt } from './../../models/receipt';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/app/models/client';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  displayedColumns = ['receiptId', 'date_of_issue', 'time_limit', 'total_amount', 'dept' ];
  dataSource: MatTableDataSource<Receipt>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private receipts: Receipt[];


  constructor( private receiptService : ReceiptService) { }

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

}
