import { ReceiptLastYearComponent } from "./components/receipt/receipt_last_year/receipt_last_year.component";
import { ReceiptComponent } from "./components/receipt/receipt.component";
import { ClientTableComponent } from "./components/client/client_table/client_table.component";
import { ClientComponent } from "./components/client/client.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, ExtraOptions } from "@angular/router";
import { CompanyComponent } from "./components/company/company.component";
import { ClientFormComponent } from "./components/client/client_form/client_form.component";
import { ReceiptFormComponent } from "./components/receipt/receipt_form/receipt_form.component";
import { ReceiptTableComponent } from "./components/receipt/receipt_table/receipt_table.component";
import { ItemTableComponent } from "./components/item/item_table/item_table.components";
import { ItemFormComponent } from "./components/item/item-form/item-form.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { PaymentFormComponent } from "./components/payment/payment-form/payment-form.component";
import { PaymentTableComponent } from "./components/payment/payment-table/payment-table.component";
import { CompanyFormComponent } from "./components/company/company-form/company-form.component";
import { UserComponent } from "./components/user/user.component";
import { CompanyTableComponent } from "./components/company/company-table/company-table.component";
import { AuthGuard } from "./services/user/auth.guard";
import { CompanyroComponent } from './components/company/companyro.component';

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: "always",
};

const routes: Routes = [
  { path: "signup", component: UserComponent },
  { path: "signin", component: UserComponent },
  { path: "", redirectTo: "signin", pathMatch: "full" },
  { path: "client/all", component: ClientTableComponent, canActivate: [AuthGuard]},
  {path: "receipt/all", component: ReceiptTableComponent, canActivate: [AuthGuard]},
  {path: "item/all", component: ItemTableComponent, canActivate: [AuthGuard]},
  {path: "payment/all", component: PaymentTableComponent, canActivate: [AuthGuard]},
  {path: "company", component: CompanyroComponent,canActivate: [AuthGuard],
    children: [
      {path: "", component: CompanyTableComponent},
      {path: "all", component: CompanyTableComponent},
      { path: "newCompany", component: CompanyFormComponent},
      {path: ":companyid",
       children: [
          {path: "", component: CompanyComponent },
          {path: "edit", component: CompanyFormComponent},
          {path: "client", component: ClientComponent,
            children: [
               { path: "", component: ClientTableComponent },
               { path: "newClient", component: ClientFormComponent },
               { path: ":clientid/edit", component: ClientFormComponent },
               { path: ":clientid",
                children: [
              { path: "receipts", component: ReceiptComponent,
                children: [
                  { path: "", component: ReceiptTableComponent },
                  { path: "newReceipt", component: ReceiptFormComponent },
                  { path: "filteredReceiptsLastYear", component: ReceiptLastYearComponent,},
                  { path: "filteredReceiptsLast365Days", component: ReceiptLastYearComponent,},
                  { path: "filteredReceiptsBetweenTwoDates", component: ReceiptLastYearComponent, },
                  { path: "newReceipt/newItem", component: ItemFormComponent },
                  { path: ":receiptid",
                    children: [
                      { path: "edit", component: ReceiptFormComponent },
                      { path: "items", component: ItemTableComponent },
                      { path: "items/newItem", component: ItemFormComponent },
                      { path: "items/:itemid/edit", component: ItemFormComponent},
                      { path: "payments", component: PaymentComponent,
                        children: [
                          { path: "", component: PaymentTableComponent },
                          { path: "newPayment", component: PaymentFormComponent},
                          { path: ":paymentid/edit", component: PaymentFormComponent},
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
],
},   
],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
