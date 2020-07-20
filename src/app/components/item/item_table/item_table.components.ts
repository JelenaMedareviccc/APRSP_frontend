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
  showAddButton: boolean = true;
  title: String;

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
      const userId = userData["userId"];
      const username = userData["username"];
      this.title=username;
      this.itemService.getItemByUser(userId).subscribe(items => {
        this.items = items;
        this.initializeDataSource();
        this.showAddButton = false;
      }, error => {
        console.log(error);
      })

    }else {
      this.route.params.subscribe((params: Params) => {
        this.receiptId = +params["receiptid"];
     
      });
    this.itemService.getItemByReceipt(this.receiptId).subscribe(
      (items) => {
        this.items = items;
        this.initializeDataSource();
        this.showAddButton= true;
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
    this.router.navigate([`${itemid}/edit`], { relativeTo: this.route });
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: 'delete' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result: " + result);
      if (!result) {
        return;
      }
      this.itemService.deleteItem(id).subscribe(
        (res) => {
          this.initializeDataSource();
        },
        (error) => {}
      );
    });
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
}
