import { Component, OnInit } from '@angular/core';
import { ClientService } from './../../../services/client/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client_form.component.html',
  styleUrls: ['./client_form.component.css']
})

export class ClientFormComponent {

  constructor(private ClientService: ClientService) { }



}
