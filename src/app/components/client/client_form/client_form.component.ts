import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClientService } from './../../../services/client/client.service';
import { Client } from 'src/app/models/client';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-client-form',
  templateUrl: './client_form.component.html',
  styleUrls: ['./client_form.component.css']
})

export class ClientFormComponent implements OnInit {

  constructor(private clientService: ClientService) { }

  @Input() client : Client;
  @Output() clientCreated = new EventEmitter();

  ngOnInit() {

  }

  createClient(f: NgForm) {
    this.client =f.value;
    this.clientService.createClient(this.client).subscribe(data => {
      this.clientCreated.emit(data)
      f.resetForm();
    },
    error => {
      console.log(error);
     });
  }



}
