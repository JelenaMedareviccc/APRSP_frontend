import { CompanyService } from "src/app/services/company/company.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ActivatedRoute, Router, Params } from "@angular/router";
import { UserService } from "src/app/services/user/user.service";

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
  username: String;
  formText: String;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.createForm(null, null, null, null, null, null);

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
      this.formText = "Add new company";
    }
  }

  initEditForm() {
    this.companyService.getCompany(this.companyId).subscribe(
      (data) => {
        console.log(data);
        this.createForm(
          data.name,
          data.pib,
          data.address,
          data.contact,
          data.email,
          data.account_number
        );
        this.companyForm.setValue({
          name: data.name,
          pib: data.pib,
          address: data.address,
          contact: data.contact,
          email: data.email,
          account_number: data.account_number,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(name, pib, address, contact, email, account_number) {
    this.companyForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(3),
      ]),
      pib: new FormControl(pib, [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      contact: new FormControl(contact, [
        Validators.required,
        Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
      ]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      account_number: new FormControl(account_number, [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
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
          (data) => {
            this.redirectTo();
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        this.companyService.createCompany(newCompany).subscribe(
          (data) => {
            this.redirectTo();
            this.companyForm.reset();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  redirectTo() {
    if (this.router.url.includes("edit")) {
      this.router.navigate(["../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../company"], { relativeTo: this.route });
    }
  }
}
