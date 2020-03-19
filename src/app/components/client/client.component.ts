import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {


  public showClientTable : boolean;

  constructor(private _snackBar: MatSnackBar) { }
  
  ngOnInit() {
    this.showClientTable = true;
  }
  onClientCreated(client : Client) {
    let snackBarRef = this._snackBar.open("Client succesfully created with id " + client.clientId + " !", "OK");
    this.showClientTable = true;
}

addNewClient(){
  this.showClientTable = false;
}




}
