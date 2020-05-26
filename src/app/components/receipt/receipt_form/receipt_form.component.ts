import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { Receipt } from "src/app/models/receipt";
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: "app-receipt-form",
  templateUrl: "./receipt_form.component.html",
  styleUrls: ["./receipt_form.component.css"],
})
export class ReceiptFormComponent implements OnInit {
  receiptForm: FormGroup;

  constructor(private receiptService: ReceiptService,
    private route: ActivatedRoute,
    private router: Router) {}

  @Input() receipt: Receipt;
  editId: number;
  editMode:boolean= false;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.editId = +params["id"];
      this.editMode = params["id"] != null;
      this.createForm(null, null, null, null);
      if (this.editMode) {
        this.initForm();
      }
    });
  }

  initForm() {
    let date = null;
    let time_limit = null;
    let total_amount = null;
    let debt = null;

    
      this.receiptService.getReceipt(this.editId).subscribe(
        (data) => {
          date = data.date_of_issue;
          time_limit = data.time_limit;
          total_amount = data.total_amount;
          debt = data.dept;
          this.createForm(date, time_limit, total_amount, debt);
        },
        (error) => {
          console.log(error);
        }
      );
    
  }

  createForm(date, time_limit, total_amount, debt) {
    this.receiptForm = new FormGroup({
      date: new FormControl(date, Validators.required),
      time_limit: new FormControl(time_limit, Validators.required),
      total_amount: new FormControl(total_amount, [
        Validators.required,
        Validators.minLength(0),
      ]),
      debt: new FormControl(debt, Validators.required),
    });
  }

  createEditReceipt() {
    const newReceipt = this.receiptForm.value;

    if (this.editId) {
      this.receiptService
        .updateReceipt(
          new Receipt(
            this.editId,
            newReceipt.date_of_issue,
            newReceipt.time_limit,
            newReceipt.total_amount,
            newReceipt.debt
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
      this.receiptService.createReceipt(newReceipt).subscribe(
        (data) => {
          
       this.redirectTo();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  
  }

  redirectTo(){
    this.receiptService.receiptEmiter.emit(this.editMode);
    this.router.navigate(['../'], {relativeTo: this.route});

  }
}
