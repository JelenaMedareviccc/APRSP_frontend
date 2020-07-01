import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';


@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  editID: number;
  editMode: boolean = false;
  userForm: FormGroup;
  companyId: number;
  signin: boolean = false;
  auth: string = "Sign Up";

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    if (this.router.url.includes("signin")) {
      this.signin = true;
      this.auth = "Sign In";
    }
    this.initForm();
  }

  initForm() {
    if (this.signin) {
      this.createFormSignIn(null, null);
    } else {
      this.createForm(null, null, null, null, null);
    }
  }

  createFormSignIn(username, password) {
    this.userForm = new FormGroup({
      username: new FormControl(username, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(2),
      ]),
      password: new FormControl(password, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  createForm(firstName, lastName, username, email, password) {
    this.userForm = new FormGroup({
      first_name: new FormControl(firstName, [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(2),
      ]),
      last_name: new FormControl(lastName, [
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(2),
      ]),
      username: new FormControl(username, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(2),
      ]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      password: new FormControl(password, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  signInOrSignUp() {
    let newUser = this.userForm.value;
    let userId;

    if (this.signin) {
      this.userService.login(newUser).subscribe(
        (next) => {
          this.router.navigate(["../company"], { relativeTo: this.route });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      let userId;
      console.log(newUser);
      this.userService.signUp(newUser).subscribe(
        (data) => {
          userId = data.userId;
          this.router.navigate(["../newCompany"], { relativeTo: this.route });
          this.userForm.reset();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  switch() {
    this.signin = !this.signin;
    this.userForm.reset();
    this.initForm();
  }
}
