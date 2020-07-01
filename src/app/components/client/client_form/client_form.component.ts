import {
  Component,
  OnInit
} from '@angular/core';
import { ClientService } from './../../../services/client/client.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client_form.component.html',
  styleUrls: ['./client_form.component.css'],
})
export class ClientFormComponent implements OnInit {
  editID: number;
  editMode = false;
  clientForm: FormGroup;
  companyId: number;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.createForm(null, null, null, null, null, null);

    this.route.params.subscribe((params: Params) => {
      

      this.editID = +params['clientid'];
      this.editMode = params['clientid'] != null;

      this.route.parent.params.subscribe((params: Params) => {
        
        this.companyId = +params["companyid"];
        if (this.editID) {
         this.initEditForm();
       } 

      })


    });
  }

  initEditForm() {
    this.clientService.getClient(this.editID).subscribe(
      (data) => {
        console.log(data);
        this.createForm(
          data.name,
          data.client_reg_number,
          data.address,
          data.contact,
          data.email,
          data.account_number
        );
       /*  this.clientForm.setValue({
          name: data.name,
          client_reg_number: data.client_reg_number,
          address: data.address,
          contact: data.contact,
          email: data.email,
          account_number: data.account_number,
        }); */
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(name, client_reg_number, address, contact, email, account_number) {
    this.clientForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(3),
      ]),
      client_reg_number: new FormControl(client_reg_number, [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.maxLength(40)
      ]),
      contact: new FormControl(contact, [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      account_number: new FormControl(account_number, [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
    });
  }

  createOrEditClient() {
    let newClient = this.clientForm.value;
    
    this.companyService.getCompany(this.companyId).subscribe(companyInfo => {
      const company = {company: companyInfo}
      newClient = {...newClient, ...company}
      console.log(newClient);

      if (this.editMode) {
        let clientId = {clientId: this.editID};
        newClient = {...clientId, ...newClient};
        this.clientService
        .updateClient(newClient)
        .subscribe(
          (data) => {
            this.redirectTo();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.clientService.createClient(newClient).subscribe(
        (data) => {
          this.redirectTo();
          this.clientForm.reset();
        },
        (error) => {
          console.log(error);
        }
      );
    } 

    })
    
  }

  redirectTo(){

    this.clientService.clientEmiter.emit(this.editMode);
    if(this.editMode){
      this.router.navigate(['../../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }

  }
}
