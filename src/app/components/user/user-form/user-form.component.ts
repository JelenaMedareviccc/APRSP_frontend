import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
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
  updateUser: boolean = false;
  userId: number;
  changePass: boolean = false;


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    if(this.router.url.includes('changePassword')){
      this.changePass=!this.changePass;
    }

    this.initForm();
  }

  initForm() {
    if(this.router.url.includes('edit')){
      this.createUpdateForm(null, null, null, null, null);

      this.route.params.subscribe((params: Params) => {
        this.userId = +params["userid"];
        this.userService.getUser(this.userId).subscribe(user => {
          this.createUpdateForm(user.firstName, user.lastName, user.username, user.email, user.contact);

        })
        this.updateUser=true;

      });


      }
    else if (this.router.url.includes("changePassword")) {
      this.signin = true;
      this.createFormSignIn(null, null);
    } else if (this.router.url.includes("signup")) {
      this.createForm(null, null, null, null, null, null);
    } else {
      this.signin = true;
      this.createFormSignIn(null, null);
    }
  }

  createFormSignIn(username: string, password: string) {
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

  createForm(firstName: string, lastName: string, username: string, email: string, password: string, contact: string) {
    this.userForm = new FormGroup({
      firstName: new FormControl(firstName, [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(2),
      ]),
      lastName: new FormControl(lastName, [
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

  createUpdateForm(firstName: string, lastName: string, username: string, email: string, contact: string) {
    this.userForm = new FormGroup({
      firstName: new FormControl(firstName, [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(2),
      ]),
      lastName: new FormControl(lastName, [
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

  signInOrSignUpOrUpdateOrChangePassword() {
    let newUser = this.userForm.value;
    let userId: number;

    if(this.router.url.includes('edit')){
      this.userService.getUser(this.userId).subscribe(user => {
        const id = { id: this.userId };
        const role = {role: user.role}
        newUser = {...id, ...newUser, ...role};
        console.log(newUser);
        this.userService.updateUser(newUser).subscribe(() => {
          this.router.navigate(["../../../company"], { relativeTo: this.route });

        }, () => {
          this.openDialog("edit");
        })
      })

    } else if(this.router.url.includes('changePassword')){
      this.userService.changePassword(newUser).subscribe(() => {
        this.router.navigate(["../signin"], { relativeTo: this.route });


      }, ()  =>{
        this.openDialog("changePassword");

      })


    } else if (this.router.url.includes('signin')) {
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
        () => {
          this.openDialog("login");
        }
      );
    } else if(this.router.url.includes('signup')){
      console.log(newUser);
      this.userService.signUp(newUser).subscribe(
        (data) => {
          userId = data.id;
          this.router.navigate(["../company/newCompany"], { relativeTo: this.route });
          this.userForm.reset();
        },
        () => {
          this.openDialog("error");
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

  openDialog(actionType){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

    });
  }

  changePassword(){
    this.router.navigate(["../changePassword"], { relativeTo: this.route });
  }
}

