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
    "price",
    "measure"
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

          this.items = items;

        this.dataSource = new MatTableDataSource<Item>(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {}
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editItem(itemid: number) {
    this.router.navigate([`${itemid}`], { relativeTo: this.route });
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

  getTotalCost(){
    return this.items.map(item => item.price).reduce((acc, value) => acc + value , 0);
  }

}

