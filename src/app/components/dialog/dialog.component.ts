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
  title: string;
  titleYesNo: string;
  textYesNo: string;
  text: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if(this.data.action === 'delete'){
      this.titleYesNo="Delete";
      this.textYesNo="Do you want to delete this?";
      this.action = true;
    } 
    if(this.data.action ==="changeRole"){
      this.action=true;
      this.titleYesNo="Chage to admin"
      this.textYesNo="Are you sure you want this user to be admin?"
    }


 
    this.title = "Error";
    if(this.data.action === 'changePassword'){
      this.text = "Unable to change the password!";
    } else if(this.data.action ==='edit'){
      this.text="Unable to edit the account!";
    } else if(this.data.action = "error"){
      this.text = ` ${this.data.detail}`;
    } else if(this.data.action = "deleteError"){
      this.text = "Unable to delete!";
    }  else if(this.data.action = "roleError"){
      this.text = "Unable to change the role!";
    } 
  }
}
