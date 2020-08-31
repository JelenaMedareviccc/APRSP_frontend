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
    "client_reg_number",
    "address",
    "contact",
    "email",
    "account_number",
    "edit",
    "delete",
    "receipts",
  ];
  dataSource: MatTableDataSource<Client>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  clients: Client[]= [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  title: String;
  companyId: number;
  showButtons: boolean = true;

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
     this.fetchData();
    this.initializeDataSource();
  }

 fetchData() {
    
    if(this.router.url.includes('/client/all')){
      let userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData["id"];
      const username = userData["username"];
      this.title=username;
      this.clientService.getClientByUser(userId).subscribe(clients => {
        this.clients = clients;
        this.initializeDataSource();
        this.showButtons=false;
     
      }, error => {
        console.log(error);
      })
      
    } else {
      this.route.params.subscribe((params: Params) => {
        this.companyId = +params["companyid"];
        this.companyService.getCompany(this.companyId).subscribe(c => {
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
      })
     
    }

  }

  initializeDataSource(){
    this.dataSource = new MatTableDataSource<Client>(this.clients);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
    return data.name.toLowerCase().includes(filter) || data.client_reg_number.toLowerCase().includes(filter);
 };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editClient(clientid: number) {
    if(this.router.url.includes('/client/all')){
      this.clientService.getClient(clientid).subscribe(client => {
        this.companyId = client.company.companyId;
        this.router.navigate([`../../company/${this.companyId}/client/${clientid}/edit`], { relativeTo: this.route });
      } )
     
    } else {
      this.router.navigate([`${clientid}/edit`], { relativeTo: this.route });
    }
   
  }


  deleteClient(id: number) {
    const dialogRef = this.openDialog("delete");
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.clientService.deleteClient(id).subscribe(
        () => {
         this.fetchData();
        },
        () => {
          this.openDialog("deleteError");
        }
      );
    });
   

   
  }

  openDialog(actionType: String){
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

  displayReceipts(clientId: number) {
    if(this.router.url.includes('/client/all')){
      this.clientService.getClient(clientId).subscribe(client => {
        this.companyId = client.company.companyId;
        this.router.navigate([`../../company/${this.companyId}/client/${clientId}/receipts`], { relativeTo: this.route });
      } )
     
    } else {
      this.router.navigate([`../../${clientId}/receipts`], { relativeTo: this.route });
    }


  }

}
