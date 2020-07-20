import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { ItemService } from "src/app/services/item/item.service";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import * as moment from 'moment';

@Component({
  selector: "app-item-form",
  templateUrl: "./item-form.component.html",
  styleUrls: ["./item-form.component.css"],
})
export class ItemFormComponent implements OnInit {
  editID: number;
  itemForm: FormGroup;
  receiptId: number;
  formText: string;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private receiptService: ReceiptService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.editID = +p["itemid"];
      this.formText = "Add new item";
      this.route.parent.params.subscribe((params: Params) => {
        this.receiptId = +params["receiptid"];
        if (this.editID) {
          this.initEditForm();
          this.formText = "Edit item";
        }
        this.createForm(null, null, null);
      });
    });
  }

  initEditForm() {
    this.itemService.getItem(this.editID).subscribe(
      (data) => {
        console.log(data);
        const name = data.name;
        const price = data.price;
        const measure = data.measure;
        this.createForm(name, price, measure);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(name, price, measure) {
    this.itemForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(3),
      ]),
      price: new FormControl(price, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      measure: new FormControl(measure, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
  }

  createOrEditItem() {
    let newItem = this.itemForm.value;
    if (this.router.url.includes("/newReceipt/")) {
      this.itemService.addItemInList(newItem);
      this.redirectTo();
    } else {
      this.receiptService
        .getReceipt(this.receiptId)
        .subscribe((receiptInfo) => {
          const momentDate = new Date(receiptInfo.date_of_issue);
          const formattedDate = moment(momentDate).format("MM/DD/YYYY");
          receiptInfo.date_of_issue = formattedDate;
          const receipt = { receipt: receiptInfo };
          newItem = { ...newItem, ...receipt };
          console.log(newItem);
          if (this.editID) {
            const itemId = { itemId: this.editID };
            newItem = { ...itemId, ...newItem };
            this.itemService.updateItem(newItem).subscribe(
              (data) => {
                this.redirectTo();
              },
              (error) => {
                console.log(error);
                this.openDialog();
              }
            );
          } else {
            this.itemService.createItem(newItem).subscribe(
              (createdItem) => {
                this.redirectTo();
              },
              (error) => {
                this.openDialog();
                console.log(error);
              }
            );
          }
        });
    }
  }

  redirectTo() {
    this.itemForm.reset();
    this.itemService.itemEmitter.emit(this.editID);
    if (this.editID) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: 'error'},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      
    });
  }
}
