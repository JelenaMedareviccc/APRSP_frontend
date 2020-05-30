import { ReceiptComponent } from "./components/receipt/receipt.component";
import { ClientTableComponent } from "./components/client/client_table/client_table.component";
import { ClientService } from "./services/client/client.service";
import { ClientComponent } from "./components/client/client.component";

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanyComponent } from "./components/company/company.component";
import { ClientFormComponent } from "./components/client/client_form/client_form.component";
import { ReceiptFormComponent } from "./components/receipt/receipt_form/receipt_form.component";
import { ReceiptTableComponent } from "./components/receipt/receipt_table/receipt_table.component";
import { ItemTableComponent } from "./components/item/item_table/item_table.components";

const routes: Routes = [
  { path: "company", component: CompanyComponent },
  { path: "", redirectTo: "company", pathMatch: "full" },
  {
    path: "client",
    component: ClientComponent,
    children: [
      { path: "", component: ClientTableComponent },
      { path: "new", component: ClientFormComponent },
      { path: ":id", component: ClientFormComponent },
    ],
  },
  {
    path: "receipts",
    component: ReceiptComponent,
    children: [
      { path: "", component: ReceiptTableComponent },
      { path: "new", component: ReceiptFormComponent },
      { path: ":id", component: ReceiptFormComponent },
      { path: ":id/items", component: ItemTableComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
