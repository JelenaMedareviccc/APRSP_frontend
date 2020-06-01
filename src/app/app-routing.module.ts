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
import { ItemFormComponent } from "./components/item/item-form/item-form.component";
import { ItemComponent } from "./components/item/item.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { PaymentFormComponent } from "./components/payment/payment-form/payment-form.component";
import { PaymentTableComponent } from './components/payment/payment-table/payment-table.component';

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
    
   
      { path: ":receiptid/edit", component: ReceiptFormComponent}, 
    /*   { path: ":receiptid/payments",component:PaymentTableComponent},
      {path: ":receiptid/payments/:paymentid", component: PaymentFormComponent},
      {path: ":receiptid/payments/newPayment", component: PaymentFormComponent},
      {path: ":receiptid/items", component: ItemTableComponent},
      { path: ":receiptid/items/:itemid", component: ItemFormComponent} */
{ path: ":receiptid" ,
         children: [
          { path: "items", component: ItemTableComponent },
          
          { path: "items/:itemid", component: ItemFormComponent },
      
          { path: "payments", component: PaymentComponent, children: [
            
              {path: "", component: PaymentTableComponent},
              { path: "newPayment", component: PaymentFormComponent },
              { path: ":paymentid", component: PaymentFormComponent },
            ],
          },
         
        ]
      },
      { path: "newReceipt", component: ReceiptFormComponent },
      { path: "newReceipt/newItem", component: ItemFormComponent} ,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
