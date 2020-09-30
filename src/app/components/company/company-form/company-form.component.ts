import { CompanyService } from "src/app/services/company/company.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CurrencyEnum } from "../../../models/currencyEnum";

import { ActivatedRoute, Router, Params } from "@angular/router";
import { UserService } from "src/app/services/user/user.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-company-form",
  templateUrl: "./company-form.component.html",
  styleUrls: ["./company-form.component.css"],
})
export class CompanyFormComponent implements OnInit {
  companyId: number;
  editMode: boolean = false;
  companyForm: FormGroup;
  userId: number;
  username: string;
  formText: string;
  currencies = CurrencyEnum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private userService: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.createForm(null, null, null, null, null, null, null);

    let userData = JSON.parse(localStorage.getItem("userData"));
    this.userId = userData["id"];
    this.username = userData["username"];
    if (this.router.url.includes("edit")) {
      this.route.params.subscribe((params: Params) => {
        this.companyId = +params["companyid"];
        this.formText = "Edit company";
        this.initEditForm();
      });
    } else {
      this.formText = "New company";
    }
  }

  initEditForm() {
    this.companyService.getCompany(this.companyId).subscribe(
      (company) => {
        this.createForm(
          company.name,
          company.pib,
          company.address,
          company.contact,
          company.email,
          company.accountNumber,
          company.currency
        );
        this.companyForm.setValue({
          name: company.name,
          pib: company.pib,
          address: company.address,
          contact: company.contact,
          email: company.email,
          accountNumber: company.accountNumber,
          currencu: company.currency,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(
    name: string,
    pib: string,
    address: string,
    contact: string,
    email: string,
    accountNumber: string,
    currency: string
  ) {
    this.companyForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(3),
      ]),
      pib: new FormControl(pib, [
        Validators.required,
        Validators.maxLength(9),
        Validators.minLength(9),
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      contact: new FormControl(contact, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
      ]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      accountNumber: new FormControl(accountNumber, [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(20),
        Validators.pattern(/^\d{3}[-]{0,1}\d{13}[-]\d{2}$/),
      ]),
      currency: new FormControl(currency, [Validators.required]),
    });
  }

  createOrEditCompany() {
    let newCompany = this.companyForm.value;
    this.userService.getUser(this.userId).subscribe((userData) => {
      const user = { authuser: userData };
      newCompany = { ...newCompany, ...user };
      console.log(newCompany);

      if (this.router.url.includes("edit")) {
        const companyId = { companyId: this.companyId };
        newCompany = { ...companyId, ...newCompany };
        this.companyService.updateCompany(newCompany).subscribe(
          () => {
            let snackBarRef = this._snackBar.open(
              "You are successfully edit company!",
              "OK"
            );
            this.redirectTo();
          },
          (error) => {
            let detail = "";
            if (error.includes("Key")) {
              const errorIndex = error.indexOf("Key");
              const errorLength = error.length;

              detail = error.substring(errorIndex, errorLength);
            }
            this.openDialog("error", detail);
          }
        );
      } else {
        this.companyService.createCompany(newCompany).subscribe(
          () => {
            let snackBarRef = this._snackBar.open(
              "You are successfully create a company!",
              "OK"
            );
            this.redirectTo();
            this.companyForm.reset();
          },
          (error) => {
            let detail = "";
            if (error.includes("Key")) {
              const errorIndex = error.indexOf("Key");
              const errorLength = error.length;

              detail = error.substring(errorIndex, errorLength);
            }
            this.openDialog("error", detail);
          }
        );
      }
    });
  }

  redirectTo() {
    if (this.router.url.includes("edit")) {
      this.router.navigate(["../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  openDialog(actionType: string, detail: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType, detail: detail },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }
}
