import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { Receipt } from "src/app/models/receipt";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemService } from "src/app/services/item/item.service";

import { ClientService } from "src/app/services/client/client.service";
import * as moment from "moment";
import { Item } from "src/app/models/item";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { formatDate } from '@angular/common';


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
    private formBuilder: FormBuilder
  ) {}

  newReceipt: Receipt;
  @Input() receipt: Receipt;
  editId: number;
  clientId: number;
  items: Item[] = null;
  showItems: boolean = false;
  dateOfIssue: any;
  formText: string;
  today = new Date();

  ngOnInit() {
    this.route.parent.params.subscribe((data) => {
      this.clientId = +data["clientid"];
      this.editId = +data["receiptid"];
      this.formText = "New receipt";

      this.createForm(null, null, null);
      if (this.itemService.itemsList.length !== 0) {
        this.receiptService.saveReceiptDataEmitter.subscribe((receipt) => {
          this.items = this.itemService.itemsList;
          this.showItems = true;
        this.dateOfIssue = receipt.dateOfIssue;
        console.log(receipt.dateOfIssue + "RECEIPT");
          this.createForm(receipt.dateOfIssue, receipt.timeLimit, receipt.receiptNumber);
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
    let timeLimit = null;
    this.receiptService.getReceipt(this.editId).subscribe(
      (receipt) => {
        this.dateOfIssue = receipt.dateOfIssue;
        this.createForm(this.dateOfIssue, receipt.timeLimit, receipt.receiptNumber);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(dateOfIssue: any, timeLimit: number, receiptNumber: string) {
    console.log(dateOfIssue);
    this.receiptForm = this.formBuilder.group({
      dateOfIssue: new FormControl( dateOfIssue, [Validators.required]),
      timeLimit: new FormControl(timeLimit, Validators.required),
      receiptNumber: new FormControl(receiptNumber, [Validators.required,  Validators.maxLength(5),
        Validators.minLength(5),] )

    });
  
  }

  createEditReceipt() {
    this.newReceipt = this.receiptForm.value;
    this.clientService.getClient(this.clientId).subscribe((clientInfo) => {
      let client = { client: clientInfo };
      this.newReceipt = { ...this.newReceipt, ...client };
      const momentDate = new Date(this.newReceipt.dateOfIssue);
      const formattedDate = moment(momentDate).format("MM/DD/YYYY");
      this.newReceipt.dateOfIssue = formattedDate;
      if (this.editId) {
        const receiptId = { receiptId: this.editId };
        this.newReceipt = { ...this.newReceipt, ...receiptId };
        console.log(this.newReceipt);
        this.receiptService.updateReceipt(this.newReceipt).subscribe(
          () => {
            this.redirectTo();
          }, (error) => {
            let detail = "";
            if(error.includes("Key")){
              const errorIndex = error.indexOf("Key");
              const errorLength = error.length;
             
              detail = error.substring(errorIndex, errorLength);
            }
            this.openDialog('error', detail);
           
          }
        );
      } else {
        this.receiptService.createReceipt(this.newReceipt).subscribe(
          (data) => {
            console.log(data.dateOfIssue);
            if (this.itemService.itemsList) {
              let receiptForItem = data;
              const momentDate = new Date(receiptForItem.dateOfIssue);
              const formattedDate = moment(momentDate).format("MM/DD/YYYY");
              receiptForItem.dateOfIssue = formattedDate;

              console.log(receiptForItem);
              this.createItem(receiptForItem);
            }
            console.log(data);
            this.redirectTo();
          }, (error) => {
            let detail = "";
            if(error.includes("Key")){
              const errorIndex = error.indexOf("Key");
              const errorLength = error.length;
             
              detail = error.substring(errorIndex, errorLength);
            }
            this.openDialog('error', detail);
           
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
   const momentDate = new Date(this.newReceipt.dateOfIssue);
    const formattedDate = moment(momentDate).format("MM/DD/YYYY");
    this.newReceipt.dateOfIssue = formattedDate;
    console.log("ADD ITEM" +this.newReceipt.dateOfIssue);
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

  openDialog(actionType: string, detail: string){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType, detail: detail},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

    });
  }
}
