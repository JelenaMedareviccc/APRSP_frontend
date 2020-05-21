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
  public editId : number;

  constructor(private _snackBar: MatSnackBar) { }
  
  ngOnInit() {
    this.showClientTable = true;
  }
  onClientCreated(client : Client) {
    if(this.editId){
      let snackBarRef = this._snackBar.open("Client succesfully updated!", "OK");

    } else {
    let snackBarRef = this._snackBar.open("Client succesfully created with id " + client.clientId + " !", "OK");
    }
    this.showClientTable = true;
    this.editId=null;

}

addNewClient(){
  this.showClientTable = false;
  this.editId=null;
}

showClientForm(clientId:number){
  this.showClientTable=false;
  this.editId = clientId;
}


}
