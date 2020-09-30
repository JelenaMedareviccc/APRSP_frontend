import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user/user.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-registration-confirm",
  templateUrl: "./registration-confirm.component.html",
  styleUrls: ["./registration-confirm.component.css"],
})
export class RegistrationConfirmComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registrationConfirm();
  }

  registrationConfirm() {
    this.route.queryParams.subscribe((params: Params) => {
      const token = params["token"];
      console.log(token);
      this.userService.comfirmRegistration(token).subscribe(
        (user) => {
          let snackBarRef = this._snackBar.open(
            "You are successfully sign up and now your account is ready! Enjoy!!",
            "OK"
          );
          this.router.navigate(["../company/newCompany"], {
            relativeTo: this.route,
          });
        },
        (error) => {
          //dialog
        }
      );
    });
  }
}
