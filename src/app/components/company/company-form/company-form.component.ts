import { CompanyService } from 'src/app/services/company/company.service';
import { Component, OnInit, } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {
  
  companyId: number;
  editMode: boolean = false;
  companyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.companyService.companyEmitter.subscribe( id => {
      this.companyId = +id;
      this.editMode = this.companyId != null;
      this.createForm(null, null, null,null, null, null);

      if (this.editMode) {
        this.initEditForm();
      }


    })
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
         /*  data.password, */
          data.account_number
        );
        this.companyForm.setValue({
          name: data.name,
          pib: data.pib,
          address: data.address,
          contact: data.contact,
          email: data.email,
          account_number: data.account_number/* ,
          password: data.password */
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
        Validators.minLength(3)
      ]),
       /*  password: new FormControl(password, [
          Validators.required,
          Validators.minLength(6)]
        ), */
        pib: new FormControl(pib, [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.maxLength(40)
      ]),
      contact: new FormControl(contact, [Validators.required,  Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      account_number: new FormControl(account_number, [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
    });
  }

  createOrEditCompany() {
    let newCompany = this.companyForm.value;


    if (this.editMode) {
      const companyId = {companyId : this.companyId};
      newCompany ={...companyId, ...newCompany};
        this.companyService
        .updateCompany(newCompany)
        .subscribe(
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
  }

  redirectTo(){
      this.router.navigate(['../'], {relativeTo: this.route});
    

  }



}
