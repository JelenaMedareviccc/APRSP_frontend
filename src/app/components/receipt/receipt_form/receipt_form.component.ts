import {
  Component,
  OnInit,
  Input,
} from "@angular/core";
import {

  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { Receipt } from "src/app/models/receipt";
import { ActivatedRoute, Router} from "@angular/router";
import { ItemService } from "src/app/services/item/item.service";

import { ClientService } from 'src/app/services/client/client.service';
import * as moment from 'moment';



@Component({
  selector: "app-receipt-form",
  templateUrl: "./receipt_form.component.html",
  styleUrls: ["./receipt_form.component.css"]
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
  clientId: number;

  ngOnInit() {

    
    this.route.parent.params.subscribe(data => {
      this.clientId = +data["clientid"];
      this.editId = +data["receiptid"];
     

      this.createForm(null, null);

      if(this.itemService.itemsList.length !== 0){
        this.receiptService.saveReceiptDataEmitter.subscribe(data => {
          console.log(data);
          this.createForm(data.date_of_issue, data.time_limit);

        });
      }
      
      
      if (this.editId) {
        console.log(this.editId);

        this.initForm();
      }
    });
  }

  initForm() {
    let date_of_issue = null;
    let time_limit = null;

    this.receiptService.getReceipt(this.editId).subscribe(
      (data) => {
        
        date_of_issue = data.date_of_issue;
        console.log(date_of_issue);
        time_limit = data.time_limit;

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
      time_limit: new FormControl(time_limit, Validators.required)
    });
  }
 
  createEditReceipt() {

     this.newReceipt= this.receiptForm.value;
    this.clientService.getClient(this.clientId).subscribe(clientInfo => {
      let client = {client: clientInfo}
      this.newReceipt = {...this.newReceipt, ...client}
      const momentDate = new Date(this.newReceipt.date_of_issue);
      const formattedDate = moment(momentDate).format("MM/DD/YYYY");
      this.newReceipt.date_of_issue = formattedDate;
      
    if (this.editId) {
      const receiptId = {receiptId: this.editId}
      this.newReceipt = {...this.newReceipt, ...receiptId}
      console.log(this.newReceipt);
      this.receiptService.updateReceipt(this.newReceipt).subscribe(
        (data) => {
          this.redirectTo();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.receiptService.createReceipt(this.newReceipt).subscribe(
        (data) => {
          console.log(data.date_of_issue);
          if (this.itemService.itemsList) {
            let receiptForItem = data;
            this.createItem(receiptForItem);
          }

          console.log(data);
          this.redirectTo();
        },
        (error) => {
          console.log(error);
        }
      );
      
    }
  })
  }

  createItem(receipt: Receipt) {
    let items = this.itemService.itemsList;

    for (let item of items) {
      const itemReceipt = {receipt : receipt}
      item = {...item, ...itemReceipt};
      this.itemService.createItem(item).subscribe((data) => {
        console.log(data);
      });
    }
    this.itemService.itemsList = [];
  }

  onAddItem() {
    this.newReceipt= this.receiptForm.value;
    const momentDate = new Date(this.newReceipt.date_of_issue);
    const formattedDate = moment(momentDate).format("MM/DD/YYYY");
    this.newReceipt.date_of_issue = formattedDate;

    this.receiptService.saveReceiptDataEmitter.next(this.newReceipt);
    this.router.navigate(["newItem"], { relativeTo: this.route });
  }

  redirectTo() {
    this.receiptService.receiptEmiter.emit(this.editId);
    if(this.editId){
      this.router.navigate(["../../"], { relativeTo: this.route });

    } else {
    this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
}

