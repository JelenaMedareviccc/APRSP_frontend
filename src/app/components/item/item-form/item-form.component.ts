import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { ItemService } from "src/app/services/item/item.service";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import * as moment from 'moment';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: "app-item-form",
  templateUrl: "./item-form.component.html",
  styleUrls: ["./item-form.component.css"],
})
export class ItemFormComponent implements OnInit {
  editId: number;
  itemForm: FormGroup;
  receiptId: number;
  formText: string;
  currency: string;
  companyId:number;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private receiptService: ReceiptService,
    public dialog: MatDialog,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.editId = +p["itemid"];
      this.formText = "New item";
      this.route.parent.params.subscribe((params: Params) => {
          this.companyId = +params["companyid"];
          this.receiptId = +params["receiptid"];

          this.companyService.getCompany(this.companyId).subscribe(company => {
            this.currency = company.currency;
          })
        
       
        if (this.editId) {
          this.initEditForm();
          this.formText = "Edit item";
        }
        this.createForm(null, null, null);
      });
    });
  }

  initEditForm() {
    this.itemService.getItem(this.editId).subscribe(
      (item) => {
        this.createForm(item.name, item.price, item.measure);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(name: string, price: number, measure: number) {
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
          const momentDate = new Date(receiptInfo.dateOfIssue);
          const formattedDate = moment(momentDate).format("MM/DD/YYYY");
          receiptInfo.dateOfIssue = formattedDate;
          const receipt = { receipt: receiptInfo };
          newItem = { ...newItem, ...receipt };
          console.log(newItem);
          if (this.editId) {
            const itemId = { itemId: this.editId };
            newItem = { ...itemId, ...newItem };
            this.itemService.updateItem(newItem).subscribe(
              () => {
                this.redirectTo();
              },
              () => {
                this.openDialog("error");
              }
            );
          } else {
            this.itemService.createItem(newItem).subscribe(
              () => {
                this.redirectTo();
              },
              () => {
                this.openDialog("error");
              }
            );
          }
        });
    }
  }

  redirectTo() {
    this.itemForm.reset();
    this.itemService.itemEmitter.emit(this.editId);
    if (this.editId) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  openDialog(actionType: String){
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
