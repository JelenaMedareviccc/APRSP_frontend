import { CompanyService } from "./../../../services/company/company.service";
import { ClientService } from "./../../../services/client/client.service";
import { Component, OnInit, Input, ViewChild, Output } from "@angular/core";
import { Client } from "src/app/models/client";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: "app-user-table",
  templateUrl: "./user-table.component.html",
  styleUrls: ["./user-table.component.css"],
})
export class UserTableComponent implements OnInit {
  displayedColumns = [
    "id",
    "firstName",
    "lastName",
    "username",
    "email",
    "contact",
    "role",
    "changeRole",
    "edit",
    "delete"
  ];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  users: User[]= [];
  showUsers: boolean = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     this.fetchData();
  }

 fetchData() {


        this.userService.getUsers().subscribe((users) => {
          this.users = users;
          this.initializeDataSource();
        }, error => {
          console.log(error);
        });

  }

  initializeDataSource(){
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
    return data.username.toLowerCase().includes(filter) || data.firstName.toLowerCase().includes(filter) || data.lastName.toLowerCase().includes(filter);
 };

    if(this.users){
      this.showUsers=true;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(userid: number) {
    //promjeniti ovo
    this.router.navigate([`../user/${userid}/edit`], { relativeTo: this.route });
  }

  deleteUser(userId: number) {


  const dialogRef= this.openDialog('delete');
    if(dialogRef){

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return false;
      }
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.fetchData();
        },
        () => {
          this.openDialog("deleteError");
        }
      );

    });

    }

  }




  backToCompany() {
    this.router.navigate(["../../../"], { relativeTo: this.route });
  }

  changeRole(userId: number){


  const dialogRef= this.openDialog('changeRole');
  if(dialogRef){

  dialogRef.afterClosed().subscribe((result) => {
    if (!result) {
      return false;
    }
    this.userService.changeUserToAdmin(userId).subscribe(() => {
      this.fetchData();
    }, () =>{
      this.openDialog("roleError");
    }
    );

  });

  }

}

   openDialog(actionType: string): any{
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType },
    });

    return dialogRef;


  }



}
