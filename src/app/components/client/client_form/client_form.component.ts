
import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { ClientService } from './../../../services/client/client.service';
import { Client } from 'src/app/models/client';
import {NgForm} from '@angular/forms';


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

  constructor(private clientService: ClientService) { }

  ngOnInit() {

  }

  createClient(f: NgForm) {
    this.client =f.value;
    this.clientService.createClient(this.client).subscribe(data => {

      this.isViewable = true;
      this.isViewableOutput.emit(this.isViewable);
      // refresh the list
      this.clientCreated.emit(data)
      f.resetForm();

      return true;

    },
    error => {
      console.log(error);
     });
  }



}
