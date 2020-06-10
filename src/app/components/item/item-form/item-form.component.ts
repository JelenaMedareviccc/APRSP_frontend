import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ClientService } from "src/app/services/client/client.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Client } from "src/app/models/client";
import { ItemService } from "src/app/services/item/item.service";
import { Item } from "src/app/models/item";
import { Measure } from "src/app/models/measure-enum";

interface Food{
  value: string;
  view: string;

}

@Component({
  selector: "app-item-form",
  templateUrl: "./item-form.component.html",
  styleUrls: ["./item-form.component.css"],
})


export class ItemFormComponent implements OnInit {
  editID: number;
  editMode: boolean = false;
  itemForm: FormGroup;
  receiptId: number;
  measures = Measure;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.editID = +params["itemid"];
      this.receiptId = +params["receiptId"];
      this.editMode = params["itemid"] != null;
      this.createForm(null, null, null);

      if (this.editMode) {
        this.initEditForm();
      }
    });
   
  }

  initEditForm() {
    this.itemService.getItem(this.editID).subscribe(
      (data) => {
        console.log(data);
        this.createForm(data.name, data.price, data.measure);
        this.itemForm.setValue({
          name: data.name,
          price: data.price,
          measure: data.measure,
        });
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
        Validators.maxLength(20)
      ]),
      price: new FormControl(price, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      measure: new FormControl(measure, [Validators.required]),
    });
  }

  createOrEditItem() {
    let newItem = this.itemForm.value;
  

    if (this.editMode) {
      const receipt = {receipt: this.receiptId}
      newItem = {...newItem, ...receipt}
      this.itemService
        .updateItem(
          new Item(
            this.editID,
            newItem.name,
            newItem.price,
            newItem.measure,
            this.receiptId
    
          )
        )
        .subscribe(
          (data) => {
            this.redirectTo();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      console.log("ITEM U KOMPONENTI:");
     console.log(newItem);
      this.itemService.addItemInList(newItem);
      this.redirectTo();
      this.itemForm.reset();
    }
  }

  redirectTo() {
    this.itemService.itemEmitter.emit(this.editMode);
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
