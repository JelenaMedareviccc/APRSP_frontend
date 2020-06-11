import { Item } from 'src/app/models/item.js';
import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ItemService } from 'src/app/services/item/item.service';
import { MatSort } from '@angular/material/sort';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-item-table',
  templateUrl: './item_table.component.html',
  styleUrls: ['./item_table.component.css']
})
export class ItemTableComponent implements OnInit{
  displayedColumns = [
    "itemId",
    "name",
    "totalPrice",
    "price",
    "measure",
    "delete",
    "edit"
  ];

  dataSource: MatTableDataSource<Item>;

  items: Item[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  receiptId: number;

  constructor(
    private itemService: ItemService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.receiptId = +params["receiptid"];
      this.initializeDataSource();

    });

  }

  initializeDataSource() {
    this.itemService.getItemByReceipt(this.receiptId).subscribe(
      (items) => {
        if(items){

          this.items = items;

        this.dataSource = new MatTableDataSource<Item>(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.name.toLowerCase().includes(filter);
          
      };
      }},
      (error) => {}
    );
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

  addNewItem(){
    this.router.navigate(["newItem"], { relativeTo: this.route });

  }

  getTotalCost(){
    if(this.items){
    return this.items.map(item => item.totalPrice).reduce((acc, value) => acc + value , 0);
    }
  }

}

