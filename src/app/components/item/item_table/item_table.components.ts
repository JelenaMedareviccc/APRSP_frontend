import { Item } from "src/app/models/item.js";
import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ItemService } from "src/app/services/item/item.service";
import { MatSort } from "@angular/material/sort";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-item-table",
  templateUrl: "./item_table.component.html",
  styleUrls: ["./item_table.component.css"],
})
export class ItemTableComponent implements OnInit {
  displayedColumns = [
    "itemId",
    "name",
    "totalPrice",
    "price",
    "measure",
    "delete",
    "edit",
  ];

  dataSource: MatTableDataSource<Item>;

  items: Item[] =  [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  receiptId: number;
  showButtons: boolean = true;
  title: String;
  companyId: number;
  clientId: number;

  constructor(
    private itemService: ItemService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchData();
    this.initializeDataSource();
  }

  fetchData() {

    if(this.router.url.includes('/item/all')){
      let userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData["id"];
      const username = userData["username"];
      this.title=username;
      this.itemService.getItemByUser(userId).subscribe(items => {
        this.items = items;
        this.initializeDataSource();
        this.showButtons = false;
      }, error => {
        console.log(error);
      })

    }else {
      this.route.params.subscribe((params: Params) => {
        this.receiptId = +params["receiptid"];
        this.companyId = +params["companyid"];
        this.clientId = +params["clientid"];
     
      });
    this.itemService.getItemByReceipt(this.receiptId).subscribe(
      (items) => {
        this.items = items;
        this.initializeDataSource();
        this.showButtons= true;
      },
      (error) => {
        console.log(error);
      }
    );
    }
  }

  initializeDataSource(){
    this.dataSource = new MatTableDataSource<Item>(this.items);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function (
      data,
      filter: string
    ): boolean {
      return data.name.toLowerCase().includes(filter);
    };

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editItem(itemid: number) {
    if(this.router.url.includes('/item/all')){
      this.itemService.getItem(itemid).subscribe(item => {
        this.receiptId= item.receipt.receiptId;
        this.clientId=item.receipt.client.clientId;
        this.companyId =item.receipt.client.company.companyId;
        this.router.navigate([`../../company/${this.companyId}/client/${this.clientId}/receipts/${this.receiptId}/items/${itemid}/edit`], { relativeTo: this.route });

      })
    } else {
    this.router.navigate([`${itemid}/edit`], { relativeTo: this.route });
    }
  }

  deleteItem(id: number) {
  
    const dialogRef = this.openDialog("delete");
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.itemService.deleteItem(id).subscribe(
        () => {
         this.fetchData();
        },() => {
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

  addNewItem() {
    this.router.navigate(["newItem"], { relativeTo: this.route });
  }

  getTotalCost() {
    if (this.items) {
      return this.items
        .map((item) => item.totalPrice)
        .reduce((acc, value) => acc + value, 0);
    }
  }

  backToReceipts() {
    this.router.navigate(["company/" + this.companyId + "/client/" + this.clientId + "/receipts"]);
  }

}
