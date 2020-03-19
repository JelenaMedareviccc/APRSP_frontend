import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {


  public isViewable : boolean;

  constructor(private _snackBar: MatSnackBar) { }
  
  ngOnInit() {
    this.isViewable = true;
  }
  onClientCreated(client : Client) {
    this._snackBar.open("Client succesfully created with id " + client.clientId + " !", "OK");
}

addNewClient(){
  this.isViewable = false;
}

isViewableOutForm($event) {
  this.isViewable = $event;
}


}
