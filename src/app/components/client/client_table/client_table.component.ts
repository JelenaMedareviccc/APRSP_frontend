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

@Component({
  selector: "app-client-table",
  templateUrl: "./client_table.component.html",
  styleUrls: ["./client_table.component.css"],
})
export class ClientTableComponent implements OnInit {
  displayedColumns = [
    "clientId",
    "name",
    "clientRegNumber",
    "address",
    "contact",
    "email",
    "accountNumber",
    "edit",
    "delete",
    "receipts",
  ];
  dataSource: MatTableDataSource<Client>;
  clients: Client[] = [];
  title: string;
  companyId: number;
  showButtons: boolean = false;
  showClients: boolean = false;
  @ViewChild(MatSort, { static: false })
  set sort(v: MatSort) {
    this.dataSource.sort = v;
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    if (this.router.url.includes("/client/all")) {
      let userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData["id"];
      const username = userData["username"];
      this.title = username;
      this.clientService.getClientByUser(userId).subscribe(
        (clients) => {
          this.clients = clients;
          this.initializeDataSource();
          this.showButtons = false;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.route.params.subscribe((params: Params) => {
        this.companyId = +params["companyid"];
        this.companyService.getCompany(this.companyId).subscribe((c) => {
          this.title = c.name;
        });
        this.clientService.getClientByCompany(this.companyId).subscribe(
          (clients) => {
            this.clients = clients;
            this.initializeDataSource();
            this.showButtons = true;
          },
          (error) => {
            console.log(error);
          }
        );
      });
    }
  }

  initializeDataSource() {
    this.dataSource = new MatTableDataSource<Client>(this.clients);

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return (
        data.name.toLowerCase().includes(filter) ||
        data.clientRegNumber.toLowerCase().includes(filter)
      );
    };
    if (this.clients) {
      this.showClients = true;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editClient(clientid: number) {
    if (this.router.url.includes("/client/all")) {
      this.clientService.getClient(clientid).subscribe((client) => {
        this.companyId = client.company.companyId;
        this.router.navigate(
          [`../../company/${this.companyId}/client/${clientid}/edit`],
          { relativeTo: this.route }
        );
      });
    } else {
      this.router.navigate([`${clientid}/edit`], { relativeTo: this.route });
    }
  }

  deleteClient(clientid: number) {
    const dialogRef = this.openDialog("delete");
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.clientService.deleteClient(clientid).subscribe(
        () => {
          this.fetchData();
        },
        () => {
          this.openDialog("deleteError");
        }
      );
    });
  }

  openDialog(actionType: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType },
    });

    return dialogRef;
  }

  addNewClient() {
    this.router.navigate(["newClient"], { relativeTo: this.route });
  }

  backToCompany() {
    this.router.navigate(["../../../"], { relativeTo: this.route });
  }

  displayReceipts(clientid: number) {
    if (this.router.url.includes("/client/all")) {
      this.clientService.getClient(clientid).subscribe((client) => {
        this.companyId = client.company.companyId;
        this.router.navigate(
          [`../../company/${this.companyId}/client/${clientid}/receipts`],
          { relativeTo: this.route }
        );
      });
    } else {
      this.router.navigate([`../../${clientid}/receipts`], {
        relativeTo: this.route,
      });
    }
  }
}
