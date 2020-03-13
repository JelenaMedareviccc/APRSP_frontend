import { ClientService } from './../../../services/client/client.service';
import {Component, OnInit, Input} from '@angular/core';
import { Client } from 'src/app/models/client';
import { MatTableDataSource } from '@angular/material/table'


@Component({
  selector: 'app-client-table',
  templateUrl: './client_table.component.html',
  styleUrls: ['./client_table.component.css']
})

export class ClientTableComponent implements OnInit {

  displayedColumns = ['clientId', 'name', 'client_reg_number', 'address', 'contact', 'email', 'account_number'];
  dataSource: MatTableDataSource<Client>;

  @Input() clients: Client[];
  @Input() hasClients = true;


  constructor(private ClientService: ClientService) { }

  ngOnInit() {
    this.initializeDataSource();
    console.log("JECAIACA22222222222");
  }

  initializeDataSource() {
    console.log("JECAIACAPRIJEGET");
    this.ClientService.getClients().subscribe(clients => {
      console.log("JECAIACAGET");
      if (this.hasClients) {
        this.clients = clients;
      }
      this.dataSource = new MatTableDataSource<Client>(this.clients);
    } , error => {});
  }
}

