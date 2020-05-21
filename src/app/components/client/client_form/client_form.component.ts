
import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { ClientService } from './../../../services/client/client.service';
import { Client } from 'src/app/models/client';
import {NgForm, FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-client-form',
  templateUrl: './client_form.component.html',
  styleUrls: ['./client_form.component.css']
})

export class ClientFormComponent implements OnInit {

  @Input() client : Client;
  @Output() isViewableOutput =  new EventEmitter<boolean>();
  private isViewable : boolean;

  @Output() clientCreated = new EventEmitter();
  @Input("editId") editId: number;
  clientForm: FormGroup ;


  constructor(private clientService: ClientService) { }

  ngOnInit() {

   this.createForm(null, null, null, null, null, null);

    if(this.editId){
      this.initEditForm();
    } 
    
  }

  
  initEditForm(){   
      this.clientService.getClient(this.editId).subscribe(data => {
console.log(data);
        this.createForm(data.name, data.client_reg_number, data.address,data.contact, data.email, data.account_number);
        this.clientForm.setValue({"name": data.name, "client_reg_number": data.client_reg_number, "address": data.address,
      "contact": data.contact, "email": data.email, "account_number": data.account_number});
      
     
      }, error => {
        console.log(error);
      })
   
  
  }


  createForm (name, client_reg_number, address, contact, email, account_number){
    this.clientForm = new FormGroup({
      'name': new FormControl(name, [Validators.required,Validators.maxLength(20)]),
      'client_reg_number': new FormControl(client_reg_number, [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),
      'address': new FormControl(address, [Validators.required, Validators.maxLength(20)]),
      'contact': new FormControl(contact, Validators.required),
      'email': new FormControl(email, [Validators.required, Validators.email]),
      'account_number': new FormControl(account_number, [Validators.required, Validators.maxLength(16), Validators.minLength(16)])
    })

  }



  createOrEditClient() {
    const newClient = this.clientForm.value;

  if(this.editId){
    this.clientService.updateClient(new Client(this.editId, newClient.name, newClient.client_reg_number, newClient.address, newClient.contact, newClient.email,newClient.account_number)).subscribe(data => {
      this.clientCreated.emit(data);
  
    }, error => {
      console.log(error);
    })

  } else {
    this.clientService.createClient(newClient).subscribe(data => {
      this.clientCreated.emit(data)
      this.clientForm.reset();

    }, error => {
      console.log(error);
    })
  }
    /* 
    this.receipt = f.value;
    this.receiptService.createReceipt(this.receipt).subscribe(data => {
      // refresh the list

      return true;
    },
    error => {
      console.log(error);
     });
     */
  } 


/* 
  createClient(f: NgForm) {
    this.client =f.value;
    this.clientService.createClient(this.client).subscribe(data => {

     // this.isViewable = true;
     // this.isViewableOutput.emit(this.isViewable);
      // refresh the list
      this.clientCreated.emit(data)
      f.resetForm();

      return true;

    },
    error => {
      console.log(error);
     });
  } */



}
