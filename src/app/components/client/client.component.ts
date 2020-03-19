import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  public isViewable : boolean;
  constructor() { 
    
  }

  ngOnInit() {
    this.isViewable = true;
  }


  addNewClient(){
    this.isViewable = false;
  }

  isViewableOutForm($event) {
    this.isViewable = $event;
  }


}
