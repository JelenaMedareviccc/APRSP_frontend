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

import { CompanyTableComponent } from "./components/company/company-table/company-table.component";
import { AuthGuard } from "./services/user/auth.guard";
import { CompanyroComponent } from "./components/company/companyro.component";
import { UserFormComponent } from "./components/user/user-form/user-form.component";
import { UserTableComponent } from "./components/user/user-table/user-table.component";
import { UserAccountComponent } from "./components/user/user-account/user-account.component";
import { PaymentsPercentageForClientsComponent } from "./components/company/payments-percentage-for-clients/payments-percentage-for-clients.component";
import { RegistrationConfirmComponent } from "./components/user/registration-confirm/registration-confirm.component";
import { InfoComponent } from "./components/info/info.component";

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: "always",
};

const routes: Routes = [
  { path: "signup", component: UserFormComponent },
  { path: "signin", component: UserFormComponent },
  { path: "changePassword", component: UserFormComponent },
  { path: "registrationConfirm", component: RegistrationConfirmComponent },
  { path: "confirmResetPassword", component: UserFormComponent },
  { path: "confirmEmail", component: InfoComponent },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      { path: "users", component: UserTableComponent },
      { path: "user/:userid", component: UserAccountComponent },
      { path: "user/:userid/edit", component: UserFormComponent },
      { path: "client/all", component: ClientTableComponent },
      { path: "receipt/all", component: ReceiptTableComponent },
      { path: "item/all", component: ItemTableComponent },
      { path: "payment/all", component: PaymentTableComponent },
      {
        path: "company",
        component: CompanyroComponent,
        children: [
          { path: "", component: CompanyTableComponent },
          { path: "newCompany", component: CompanyFormComponent },
          {
            path: ":companyid",
            children: [
              { path: "", component: CompanyComponent },
              { path: "edit", component: CompanyFormComponent },
              {
                path: "paymentPercentageForClients",
                component: PaymentsPercentageForClientsComponent,
              },
              {
                path: "paymentsForLast365Days",
                component: PaymentTableComponent,
              },
              {
                path: "client",
                component: ClientComponent,
                children: [
                  { path: "", component: ClientTableComponent },
                  { path: "newClient", component: ClientFormComponent },
                  { path: ":clientid/edit", component: ClientFormComponent },
                  {
                    path: ":clientid",
                    children: [
                      {
                        path: "receipts",
                        component: ReceiptComponent,
                        children: [
                          { path: "", component: ReceiptTableComponent },
                          {
                            path: "newReceipt",
                            component: ReceiptFormComponent,
                          },
                          {
                            path: "filteredReceiptsLastYear",
                            component: ReceiptLastYearComponent,
                          },
                          {
                            path: "filteredReceiptsLast365Days",
                            component: ReceiptLastYearComponent,
                          },
                          {
                            path: "filteredReceiptsBetweenTwoDates",
                            component: ReceiptLastYearComponent,
                          },
                          {
                            path: "filteredReceiptsForSelectedYear",
                            component: ReceiptLastYearComponent,
                          },
                          {
                            path: "newReceipt/newItem",
                            component: ItemFormComponent,
                          },
                          {
                            path: ":receiptid",
                            children: [
                              { path: "edit", component: ReceiptFormComponent },
                              { path: "items", component: ItemTableComponent },
                              {
                                path: "items/newItem",
                                component: ItemFormComponent,
                              },
                              {
                                path: "items/:itemid/edit",
                                component: ItemFormComponent,
                              },
                              {
                                path: "payments",
                                component: PaymentComponent,
                                children: [
                                  {
                                    path: "",
                                    component: PaymentTableComponent,
                                  },
                                  {
                                    path: "newPayment",
                                    component: PaymentFormComponent,
                                  },
                                  {
                                    path: ":paymentid/edit",
                                    component: PaymentFormComponent,
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
        ],
      },
    ],
  },
  { path: "", redirectTo: "signin", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
