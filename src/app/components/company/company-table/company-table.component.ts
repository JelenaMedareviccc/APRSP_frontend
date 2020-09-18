import { CompanyService } from "./../../../services/company/company.service";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
} from "@angular/core";

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
    "accountNumber",
    "edit",
    "delete",
    "clients",
  ];
  dataSource: MatTableDataSource<Company>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() hasCompany = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  userName: string;
  userId: number;
  companies: Company[];
  showCompany: boolean;
  showYearPicker: boolean;


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
      (companies) => {
        this.showCompany = true;
       this.companies = companies;
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

  editCompany(companyId: number) {
    this.router.navigate([`${companyId}/edit`], { relativeTo: this.route });
  }

  deleteCompany(companyId: number) {
    const dialogRef = this.openDialog("delete");

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.companyService.deleteCompany(companyId).subscribe(
        () => {
          this.initializeDataSource();
        },
        () => {
          this.openDialog("deleteError");
        }
      );
    });
  }

  openDialog(actionType: string): any{
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
        data: { action: actionType },
    });
    return dialogRef;
  }

  addNewCompany() {
    this.router.navigate(["newCompany"], { relativeTo: this.route });
  }

  onRowClick(companyid: any){
    this.router.navigate([`${companyid}`], { relativeTo: this.route });


  }



}
