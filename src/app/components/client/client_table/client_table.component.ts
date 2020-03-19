import { ClientService } from './../../../services/client/client.service';
import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { Client } from 'src/app/models/client';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-client-table',
  templateUrl: './client_table.component.html',
  styleUrls: ['./client_table.component.css']
})

export class ClientTableComponent implements OnInit {

  displayedColumns = ['clientId', 'name', 'client_reg_number', 'address', 'contact', 'email', 'account_number'];
  dataSource: MatTableDataSource<Client>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() clients: Client[];
  @Input() hasClients = true;


  constructor(private ClientService: ClientService) { }

  ngOnInit() {
    this.initializeDataSource();
  }

  initializeDataSource() {
    this.ClientService.getClients().subscribe(clients => {
      if (this.hasClients) {
        this.clients = clients;
      }
      this.dataSource = new MatTableDataSource<Client>(this.clients);
      this.dataSource.paginator = this.paginator;
    } , error => {});
  }

}

