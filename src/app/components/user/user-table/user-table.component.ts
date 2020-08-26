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
    "first_name",
    "last_name",
    "username",
    "email",
    "contact",
    "role",
    "change_to_admin",
    "edit",
    "delete"
  ];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  users: User[]= [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  checked: boolean = false;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     this.fetchData();
    this.initializeDataSource();
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
    console.log(this.users);
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
    return data.username.toLowerCase().includes(filter) || data.first_name.toLowerCase().includes(filter) || data.last_name.toLowerCase().includes(filter);
 };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(userid: number) {
    //promjeniti ovo
    this.router.navigate([`../user/${userid}/edit`], { relativeTo: this.route });
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: 'delete' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result: " + result);
      if (!result) {
        return;
      }
      this.userService.deleteUser(id).subscribe(
        (res) => {
          this.fetchData();
        },
        (error) => {}
      );
    });
  }

  backToCompany() {
    this.router.navigate(["../../../"], { relativeTo: this.route });
  }

}
