import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { Receipt } from "src/app/models/receipt";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemService } from "src/app/services/item/item.service";

import { ClientService } from "src/app/services/client/client.service";

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
    private clientService: ClientService
  ) {}

  newReceipt: Receipt;
  @Input() receipt: Receipt;
  editId: number;
  editMode: boolean = false;
  clientId: number;

  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get("clientid");
    this.editId = +this.route.snapshot.paramMap.get("editid");
    console.log(this.clientId);

    this.editMode = this.editId != null;

    this.createForm(null, null, null);

    console.log(this.itemService.getItemsList());
    if (this.itemService.itemsList.length !== 0) {
      console.log("USAO!");
      this.receiptService.saveReceiptDataEmitter.subscribe((data) => {
        console.log("DATA: ");
        console.log(data);
        this.createForm(data.date_of_issue, data.time_limit, data.dept);
      });
    }

    if (this.editMode) {
      this.initForm();
    }
  }

  initForm() {
    let date = null;
    let time_limit = null;
    let debt = null;

    console.log(this.editId);
    this.receiptService.getReceipt(this.editId).subscribe(
      (data) => {
        date = data.date_of_issue;
        time_limit = data.time_limit;
        debt = data.dept;
        this.createForm(date, time_limit, debt);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(date, time_limit, debt) {
    this.receiptForm = new FormGroup({
      date: new FormControl(date, Validators.required),
      time_limit: new FormControl(time_limit, Validators.required),
      debt: new FormControl(debt, Validators.required),
      /*   items: new FormArray(items), */
    });
  }

  createEditReceipt() {
    this.newReceipt = this.receiptForm.value;
    this.clientService.getClient(this.clientId).subscribe((clientInfo) => {
      let client = { client: clientInfo };
      this.newReceipt = { ...this.newReceipt, ...client };

      if (this.editId) {
        const receiptId = { receiptId: this.editId };
        this.newReceipt = { ...this.newReceipt, ...receiptId };
        this.receiptService.updateReceipt(this.newReceipt).subscribe(
          (data) => {
            this.redirectTo();
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log(this.itemService.itemsList.length);
        if (this.itemService.itemsList.length !== 0) {
          console.log("ZASTO NISI OVDJE");
          this.receiptService.createReceipt(this.newReceipt).subscribe(
            (data) => {
              if (this.itemService.itemsList) {
                this.createItem(data.receiptId);
              }

              this.redirectTo();
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    });
  }

  createItem(receiptId: number) {
    let items = this.itemService.itemsList;

    for (let item of items) {
      item.receiptId = receiptId;
      this.itemService.createItem(item).subscribe((data) => {
        console.log(data);
      });
    }
    this.itemService.itemsList;
  }

  onAddItem() {
    this.newReceipt = this.receiptForm.value;
    console.log(this.newReceipt);
    this.receiptService.saveReceiptDataEmitter.next(this.newReceipt);
    this.router.navigate(["newItem"], { relativeTo: this.route });
  }

  redirectTo() {
    this.receiptService.receiptEmiter.emit(this.editMode);
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
