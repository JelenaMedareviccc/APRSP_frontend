import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
  template: 'passed in {{ data.action }}',
})
export class DialogComponent implements OnInit {

  action: boolean = false;
  password: boolean = false;
  title: String;
  text: String;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if(this.data.action === 'delete'){
      this.action = true;
    } 
 
    this.title = "Error";
    if(this.data.action === 'login'){
 
     this.text =  "Invalid login!";
    } 
    if(this.data.action === 'changePassword'){
      this.text = "Unable to change the password, please try again!";
    }
    if(this.data.action ==='edit'){
      this.text="Unable to edit the account, please try again!";
    }
    if(this.data.action = "error"){
      this.text = "Invalid form, please fill it in again!";
    }
  }
}
