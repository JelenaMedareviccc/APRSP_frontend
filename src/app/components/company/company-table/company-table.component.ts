import { CompanyService } from "./../../../services/company/company.service";
import { ClientService } from "./../../../services/client/client.service";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { Client } from "src/app/models/client";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { Company } from "src/app/models/company";

@Component({
  selector: "app-company-table",
  templateUrl: "./company-table.component.html",
  styleUrls: ["./company-table.component.css"],
})
export class CompanyTableComponent implements OnInit {
  displayedColumns = [
    "companyId",
    "name",
    "pib",
    "address",
    "contact",
    "email",
    "account_number",
    "edit",
    "delete",
    "clients",
  ];
  dataSource: MatTableDataSource<Company>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() hasCompany = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  userName: String;
  userId: number;
  companies: Company[];
  showCompany: boolean;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.showCompany = false;
    let userData = JSON.parse(localStorage.getItem("userData"));
    this.userId = userData["id"];
    this.userName = userData["username"];

    this.initializeDataSource();
  }

  initializeDataSource() {
    this.companyService.getCompanyByUser(this.userId).subscribe(
      (c) => {
        this.showCompany = true;
       this.companies = c;
      this.dataSource = new MatTableDataSource<Company>(this.companies);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = function (
        data,
        filter: string
      ): boolean {
        return (
          data.name.toLowerCase().includes(filter) ||
          data.email.toLowerCase().includes(filter)
        );
      };
   
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCompany(companyId) {
    this.router.navigate([`${companyId}/edit`], { relativeTo: this.route });
  }

  deleteCompany(id: number) {
    const dialogRef = this.openDialog("delete");
  
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.companyService.deleteCompany(id).subscribe(
        () => {
          this.initializeDataSource();
        },
        () => {
          this.openDialog("deleteError");
        }
      );
    });
  }

  openDialog(actionType: String): any{
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
        data: { action: actionType },
    });
    return dialogRef;
  }

  addNewCompany() {
    this.router.navigate(["newCompany"], { relativeTo: this.route });
  }

}
