import { ClientService } from "./../../../services/client/client.service";
import { Receipt } from "./../../../models/receipt";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as moment from "moment";

import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY'
  },
};

@Component({
  selector: "app-receipt-table",
  templateUrl: "./receipt_table.component.html",
  styleUrls: ["./receipt_table.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      
    },
    
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReceiptTableComponent implements OnInit {
  displayedColumns = [
    "receiptId",
    "date_of_issue",
    "time_limit",
    "total_amount",
    "debt",
    "percentage_interest",
    "payment",
    "delete",
    "edit",
    "items",
  ];
  dataSource: MatTableDataSource<Receipt>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  clientId: number;
  title: String;
  dateForm: FormGroup;
  year: FormControl;
  showBetweenFilter: boolean;
  showYearPicker: boolean;
  showFilter: boolean = false;
  showButtons: boolean = true;
  companyId: number;



  private receipts: Receipt[] = [];

  constructor(
    private receiptService: ReceiptService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchData() {
    this.dateForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    });
    this.year = new FormControl(moment(), Validators.required);
    if(this.router.url.includes('receipt/all')){
      let userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData["id"];
      const username = userData["username"];
      this.title=username;
      this.receiptService.getReceiptByUser(userId).subscribe(receipts => {
        this.receipts = receipts;
        this.initializeDataSource();
        this.showButtons = false;
      }, error => {
        console.log(error);
      })

    } else{
      this.route.params.subscribe((params: Params) => {
        this.clientId = +params["clientid"];
        this.clientService.getClient(this.clientId).subscribe((client) => {
          this.title = client.name;
        });

        this.receiptService.getReceiptByClient(this.clientId).subscribe(
          (receipts) => {
            this.receipts = receipts;
            this.initializeDataSource();
            this.showButtons = true;
          },
          (error) => {
            console.log(error);
          }
        );
      });
   
    }
  }

  initializeDataSource(){
    this.dataSource = new MatTableDataSource<Receipt>(this.receipts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if(!this.receipts){
      this.showFilter=false;
        this.showBetweenFilter=false;
        this.showYearPicker=false;
     
      } else {
        this.showFilter = true;
        this.showBetweenFilter=true;
        this.showYearPicker=true;
        
      }
    
  }

  deleteReceipt(id: number) {
    const dialogRef = this.openDialog('delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.receiptService.deleteReceipt(id).subscribe(
        () => {
          this.fetchData();
        },
        () => {
          this.openDialog("deleteError");
        }
      );
    });
  }

  openDialog(actionType: String): any{
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType },
    });
    return dialogRef;
  }


  addNewReceipt() {
    this.router.navigate(["newReceipt"], { relativeTo: this.route });
  }

  editReceipt(receiptid: number) {
    if(this.router.url.includes('/receipt/all')){
      this.receiptService.getReceipt(receiptid).subscribe(receipt => {
        this.clientId=receipt.client.clientId;
        this.companyId =receipt.client.company.companyId;
        this.router.navigate([`../../company/${this.companyId}/client/${this.clientId}/receipts/${receiptid}/edit`], { relativeTo: this.route });

      })
    } else {
      this.router.navigate([`${receiptid}/edit`], { relativeTo: this.route });
    }
   
  }

  viewPayment(receiptid: number) {
    if(this.router.url.includes('/receipt/all')){
      this.receiptService.getReceipt(receiptid).subscribe(receipt => {
        this.clientId=receipt.client.clientId;
        this.companyId =receipt.client.company.companyId;
        this.router.navigate([`../../company/${this.companyId}/client/${this.clientId}/receipts/${receiptid}/payments`], { relativeTo: this.route });

      })
    } else {
      this.router.navigate([`${receiptid}/payments`], { relativeTo: this.route });
    }
   
  }

  showItems(receiptid: number) {
    if(this.router.url.includes('/receipt/all')){
      this.receiptService.getReceipt(receiptid).subscribe(receipt => {
        this.clientId=receipt.client.clientId;
        this.companyId =receipt.client.company.companyId;
        this.router.navigate([`../../company/${this.companyId}/client/${this.clientId}/receipts/${receiptid}/items`], { relativeTo: this.route });

      })
    } else {
      this.router.navigate([`${receiptid}/items`], { relativeTo: this.route });
    }
    
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
        .map((r) => r.debt)
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
    })

  }

  filterReceipts() {
    console.log(this.dateForm.value);
    const start = new Date(this.dateForm.value.startDate);
    const startDate = moment(start).format("MM/DD/YYYY");
    const end = new Date(this.dateForm.value.endDate);
    const endDate = moment(end).format("MM/DD/YYYY");
    
    this.router.navigate(["filteredReceiptsBetweenTwoDates"], {
      relativeTo: this.route,
      queryParams: { startDate: startDate, endDate: endDate },
    });

    
  }

  chosenYearHandler(normalizedYear: Moment,  datepicker: MatDatepicker<Moment>) {
    if(this.year.value !== null){
      const ctrlValue = this.year.value;
      ctrlValue.year(normalizedYear.year());
     
     this.year.setValue(ctrlValue);
     datepicker.close();
     
    }   
  }

  filterReceiptsForSelectedYear(){
    
    this.router.navigate(["filteredReceiptsForSelectedYear"], {
      relativeTo: this.route,
      queryParams: { year: this.year.value.format("YYYY") },
    });
 
    
   
  }

  onShowSelectedYear(){
    this.showYearPicker = !this.showYearPicker;
  }

  onShowBetweenTwoDates() {
    this.showBetweenFilter = !this.showBetweenFilter;
  }

  backToClients() {
    this.router.navigate(["company/" + this.companyId + "/client"]);
  }


}
