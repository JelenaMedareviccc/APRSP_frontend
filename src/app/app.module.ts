import { LayoutModule } from '@angular/cdk/layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientComponent } from './components/client/client.component';
import { ClientFormComponent } from './components/client/client_form/client_form.component';
import { ClientTableComponent } from './components/client/client_table/client_table.component';
import { CompanyFormComponent } from './components/company/company-form/company-form.component';
import { CompanyTableComponent } from './components/company/company-table/company-table.component';
import { CompanyComponent } from './components/company/company.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ItemFormComponent } from './components/item/item-form/item-form.component';
import { ItemComponent } from './components/item/item.component';
import { ItemTableComponent } from './components/item/item_table/item_table.components';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PaymentFormComponent } from './components/payment/payment-form/payment-form.component';
import { PaymentTableComponent } from './components/payment/payment-table/payment-table.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ReceiptFormComponent } from './components/receipt/receipt_form/receipt_form.component';
import { ReceiptLastYearComponent } from './components/receipt/receipt_last_year/receipt_last_year.component';
import { ReceiptTableComponent } from './components/receipt/receipt_table/receipt_table.component';
import { UserComponent } from './components/user/user.component';
import { ClientService } from './services/client/client.service';
import { HttpErrorInterceptor } from './services/httperrorinterceptopr.service';
import { ReceiptService } from './services/receipt/receipt.service';
import { InterceptorService } from './services/user/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    CompanyComponent,
    ReceiptComponent,
    ItemComponent,
    PaymentComponent,
    ClientComponent,

    ClientTableComponent,
    ClientFormComponent,
    CompanyFormComponent,
    DialogComponent,
    ReceiptFormComponent,
    ReceiptTableComponent,
    NavigationComponent,
    ItemTableComponent,
    ItemFormComponent,
    PaymentTableComponent,
    PaymentFormComponent,
    ReceiptLastYearComponent,
    UserComponent,
    CompanyTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
  
    MatButtonModule,
    MatButtonToggleModule,
   MatCardModule,
    MatCheckboxModule,
    
    MatDatepickerModule,
    MatDialogModule,

    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,

    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
 
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
  
    MatToolbarModule,
    MatTooltipModule,
    
    ScrollingModule,
    LayoutModule,
    ReactiveFormsModule,
    MatFormFieldModule,
        MatInputModule
  ],
  providers: [ ClientService, ReceiptService,
     {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi:true},
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
        multi: true
      }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
