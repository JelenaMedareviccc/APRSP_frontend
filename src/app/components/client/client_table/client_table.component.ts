import { ClientService } from './../../../services/client/client.service';
import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { Client } from 'src/app/models/client';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';


@Component({
  selector: 'app-client-table',
  templateUrl: './client_table.component.html',
  styleUrls: ['./client_table.component.css']
})

export class ClientTableComponent implements OnInit {

  displayedColumns = ['clientId', 'name', 'client_reg_number', 'address', 'contact', 'email', 'account_number', 'delete'];
  dataSource: MatTableDataSource<Client>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() clients: Client[];
  @Input() hasClients = true;


  constructor(private clientService: ClientService, public dialog: MatDialog) { }

  ngOnInit() {
    this.initializeDataSource();
  }

  initializeDataSource() {
    this.clientService.getClients().subscribe(clients => {
      if (this.hasClients) {
        this.clients = clients;
      }
      this.dataSource = new MatTableDataSource<Client>(this.clients);
      this.dataSource.paginator = this.paginator;
    } , error => {});
  }


  /*deleteClient(id: number){
    console.log(this.openDialog);
    if(this.openDialog() == true){
      this.clientService.deleteClient(id).subscribe();
    }


  }

  openDialog(): boolean {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("REZULTAT" +result);
      return result;
    });
    return false;
  }*/

  deleteClient(id : number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result: " + result)
      if (!result) {
        return;
      }
      this.clientService.deleteClient(id).subscribe( res => {
        this.initializeDataSource();
      }, error => {});
    });
  }
}
