import { Item } from "src/app/models/item.js";
import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ItemService } from "src/app/services/item/item.service";
import { MatSort } from "@angular/material/sort";
import { DialogComponent } from "../../dialog/dialog.component";
import { ReceiptService } from "src/app/services/receipt/receipt.service";
import { ClientService } from "src/app/services/client/client.service";

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

  items: Item[] = [];
  @ViewChild(MatSort, { static: false })
  set sort(v: MatSort) {
    this.dataSource.sort = v;
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }
  receiptId: number;
  showButtons: boolean = false;
  title: string;
  companyId: number;
  clientId: number;
  showItems: boolean = false;
  currencyType: string;
  showFooter: boolean = true;

  constructor(
    private itemService: ItemService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    if (this.router.url.includes("/item/all")) {
      let userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData["id"];
      const username = userData["username"];
      this.title = username + "'s items";
      this.itemService.getItemByUser(userId).subscribe(
        (items) => {
          this.items = items;
          this.initializeDataSource();
          this.showButtons = false;
          this.showFooter = false;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.route.params.subscribe((params: Params) => {
        this.receiptId = +params["receiptid"];
        this.companyId = +params["companyid"];
        this.clientId = +params["clientid"];
      });

      this.clientService.getClient(this.clientId).subscribe((client) => {
        this.receiptService.getReceipt(this.receiptId).subscribe((receipt) => {
          this.title =
            "Items for receipt with receipt number " + receipt.receiptNumber;
        });
        this.currencyType = client.company.currency;
      });

      this.itemService.getItemByReceipt(this.receiptId).subscribe(
        (items) => {
          this.items = items;
          this.initializeDataSource();
          this.showButtons = true;
          this.showFooter = true;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  initializeDataSource() {
    this.dataSource = new MatTableDataSource<Item>(this.items);
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
    };
    if (this.items) {
      this.showItems = true;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editItem(itemid: number) {
    if (this.router.url.includes("/item/all")) {
      this.itemService.getItem(itemid).subscribe((item) => {
        this.receiptId = item.receipt.receiptId;
        this.clientId = item.receipt.client.clientId;
        this.companyId = item.receipt.client.company.companyId;
        this.router.navigate(
          [
            `../../company/${this.companyId}/client/${this.clientId}/receipts/${this.receiptId}/items/${itemid}/edit`,
          ],
          { relativeTo: this.route }
        );
      });
    } else {
      this.router.navigate([`${itemid}/edit`], { relativeTo: this.route });
    }
  }

  deleteItem(itemId: number) {
    const dialogRef = this.openDialog("delete");
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.itemService.deleteItem(itemId).subscribe(
        () => {
          this.fetchData();
        },
        () => {
          this.openDialog("deleteError");
        }
      );
    });
  }

  openDialog(actionType: string): any {
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
    this.router.navigate([
      "company/" + this.companyId + "/client/" + this.clientId + "/receipts",
    ]);
  }
}
