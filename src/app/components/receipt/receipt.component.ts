import { Component, OnInit } from "@angular/core";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-receipt",
  templateUrl: "./receipt.component.html",
  styleUrls: ["./receipt.component.css"],
})
export class ReceiptComponent implements OnInit {
  constructor(
    private receiptService: ReceiptService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.receiptService.receiptEmiter.subscribe((editMode) => {
      if (editMode) {
        let snackBarRef = this._snackBar.open(
          "Receipt succesfully updated!",
          "OK"
        );
      } else {
        let snackBarRef = this._snackBar.open(
          "Receipt succesfully created!",
          "OK"
        );
      }
    });
  }
}
