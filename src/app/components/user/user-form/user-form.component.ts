import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';


@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.css"],
})
export class UserFormComponent implements OnInit {
  editID: number;
  editMode: boolean = false;
  userForm: FormGroup;
  companyId: number;
  signin: boolean = false;
  auth: string = "Sign Up";
  updateUser: boolean = false;
  userId: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    if(this.router.url.includes('edit')){
      this.createUpdateForm(null, null, null, null, null);
      let userData = JSON.parse(localStorage.getItem("userData"));
       this.userId = userData["id"];
      this.userService.getUser(this.userId).subscribe(user => {
        this.createUpdateForm(user.first_name, user.last_name, user.username, user.email, user.contact);

      })
      this.updateUser=true;
      }
    else if (this.router.url.includes("signin")) {
      this.signin = true;
      this.auth = "Sign In";
      this.createFormSignIn(null, null);
    } else {
      this.createForm(null, null, null, null, null, null);
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

  createForm(firstName, lastName, username, email, password, contact) {
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
      contact: new FormControl(contact, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
      ])
    });
  }

  createUpdateForm(firstName, lastName, username, email, contact) {
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
      contact: new FormControl(contact, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
      ])
    });
  }

  signInOrSignUpOrUpdate() {
    let newUser = this.userForm.value;
    let userId;

    if(this.router.url.includes('edit')){
      this.userService.getUser(this.userId).subscribe(user => {
        const id = { id: this.userId };
        const role = {role: user.role}
        newUser = {...id, ...newUser, ...role};
        console.log(newUser);
        this.userService.updateUser(newUser).subscribe(user => {
          this.router.navigate(["../../../company"], { relativeTo: this.route });

        }, error => {
          console.log(error);
        })
      })
      
     


    } else if (this.signin) {
      this.userService.login(newUser).subscribe(
        (data) => {
          userId = data.id;
          console.log(userId);
          this.companyService.getCompanyByUser(userId).subscribe(company => {
            if(!company.length){
              this.router.navigate(["../company/newCompany"], { relativeTo: this.route });
              
            } else {
          
              this.router.navigate(["../company"], { relativeTo: this.route });
            }
          })
        },
        (error) => {
          console.log(error);
          this.openDialog();
        }
      );
    } else {
      let userId;
      console.log(newUser);
      this.userService.signUp(newUser).subscribe(
        (data) => {
          userId = data.id;
          this.router.navigate(["../company/newCompany"], { relativeTo: this.route });
          this.userForm.reset();
        },
        (error) => {
          console.log(error);
          this.openDialog();
        }
      );
    }
  }

  switch() {
    this.signin = !this.signin;
    if(this.signin){
      this.router.navigate(["../signin"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../signup"], { relativeTo: this.route });
    }
    this.userForm.reset();
    this.initForm();
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: 'password' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      
    });
  }

  changePassword(){
    
  }
}

