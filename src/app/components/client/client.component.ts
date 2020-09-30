import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientService } from "src/app/services/client/client.service";

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.css"],
})
export class ClientComponent implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.clientService.clientEmiter.subscribe((client) => {
      if (client) {
        let snackBarRef = this._snackBar.open(
          "Client successfully updated!",
          "OK"
        );
      } else {
        let snackBarRef = this._snackBar.open(
          "Client successfully created!",
          "OK"
        );
      }
    });
  }

  goBack() {}
}
