import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { Receipt } from "src/app/models/receipt";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemService } from "src/app/services/item/item.service";

import { ClientService } from "src/app/services/client/client.service";
import * as moment from "moment";
import { Item } from "src/app/models/item";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: "app-receipt-form",
  templateUrl: "./receipt_form.component.html",
  styleUrls: ["./receipt_form.component.css"],
})
export class ReceiptFormComponent implements OnInit {
  receiptForm: FormGroup;

  constructor(
    private receiptService: ReceiptService,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    public dialog: MatDialog,
  ) {}

  newReceipt: Receipt;
  @Input() receipt: Receipt;
  editId: number;
  clientId: number;
  items: Item[] = null;
  showItems = false;
  date;
 
  formText: string;

  ngOnInit() {
    this.date =  new Date();
    const momentDate = new Date(this.date);
    const formattedDate = moment(momentDate).format("MM/DD/YYYY");
    this.date = formattedDate;
    console.log(this.date);
    this.route.parent.params.subscribe((data) => {
      this.clientId = +data["clientid"];
      this.editId = +data["receiptid"];
      this.formText = "Add new receipt";

      this.createForm(null, null);
      if (this.itemService.itemsList.length !== 0) {
        this.receiptService.saveReceiptDataEmitter.subscribe((data) => {
          this.items = this.itemService.itemsList;
          this.showItems = true;
          console.log(data);
          const momentDate = new Date(data.date_of_issue);
          const formattedDate = moment(momentDate).format("MM/DD/YYYY");
          this.date = formattedDate;
          console.log(this.date);
          this.createForm(this.date, data.time_limit);
        });
      }

      if (this.editId) {
        console.log(this.editId);
        this.initForm();
        this.formText = "Edit receipt"
      }
    });
  }

  initForm() {
    let date_of_issue = null;
    let time_limit = null;
    this.receiptService.getReceipt(this.editId).subscribe(
      (data) => {
        const momentDate = new Date(data.date_of_issue);
        const formattedDate = moment(momentDate).format("MM/DD/YYYY");
        date_of_issue = formattedDate;
        time_limit = data.time_limit;
        console.log(date_of_issue);
        this.createForm(date_of_issue, time_limit);
      },
      (error) => {
        console.log(error);
      }
    );
  }
 
  createForm(date_of_issue, time_limit: number) {
    this.receiptForm = new FormGroup({
      date_of_issue: new FormControl(date_of_issue, Validators.required),
      time_limit: new FormControl(time_limit, Validators.required),
    });

    this.receiptForm.controls['date_of_issue'].patchValue(date_of_issue);

  
    
  }

  createEditReceipt() {
    this.newReceipt = this.receiptForm.value;
    this.clientService.getClient(this.clientId).subscribe((clientInfo) => {
      let client = { client: clientInfo };
      this.newReceipt = { ...this.newReceipt, ...client };
      const momentDate = new Date(this.newReceipt.date_of_issue);
      const formattedDate = moment(momentDate).format("MM/DD/YYYY");
      this.newReceipt.date_of_issue = formattedDate;
      if (this.editId) {
        const receiptId = { receiptId: this.editId };
        this.newReceipt = { ...this.newReceipt, ...receiptId };
        console.log(this.newReceipt);
        this.receiptService.updateReceipt(this.newReceipt).subscribe(
          () => {
            this.redirectTo();
          },
          () => {
            this.openDialog("error");
          }
        );
      } else {
        this.receiptService.createReceipt(this.newReceipt).subscribe(
          (data) => {
            console.log(data.date_of_issue);
            if (this.itemService.itemsList) {
              let receiptForItem = data;
              const momentDate = new Date(receiptForItem.date_of_issue);
              const formattedDate = moment(momentDate).format("MM/DD/YYYY");
              receiptForItem.date_of_issue = formattedDate;

              console.log(receiptForItem);
              this.createItem(receiptForItem);
            }
            console.log(data);
            this.redirectTo();
          },
          (error) => {
            this.openDialog("error");
            console.log("error");
          }
        );
      }
    });
  }

  createItem(receipt: Receipt) {
    this.items = this.itemService.itemsList;
    for (let item of this.items) {
      console.log(item);
      const itemReceipt = { receipt: receipt };
      item = { ...item, ...itemReceipt };
      console.log("FUNKCIJA:" +item);
      console.log(item);
      this.itemService.createItem(item).subscribe((data) => {
        console.log(data);
      });
    }
    this.itemService.itemsList = [];
    this.showItems = false;
  }

  onAddItem() {
    this.newReceipt = this.receiptForm.value;
    const momentDate = new Date(this.newReceipt.date_of_issue);
    const formattedDate = moment(momentDate).format("MM/DD/YYYY");
    this.newReceipt.date_of_issue = formattedDate;
    this.receiptService.saveReceiptDataEmitter.next(this.newReceipt);
    this.router.navigate(["newItem"], { relativeTo: this.route });
  }

  redirectTo() {
    this.receiptService.receiptEmiter.emit(this.editId);
    if (this.editId) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  openDialog(actionType){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      
    });
  }
}
