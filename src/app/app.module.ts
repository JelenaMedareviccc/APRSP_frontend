import { ReceiptLastYearComponent } from './components/receipt/receipt_last_year/receipt_last_year.component';

import { ReceiptFormComponent } from './components/receipt/receipt_form/receipt_form.component';
import { ReceiptService } from './services/receipt/receipt.service';
import { ClientFormComponent } from './components/client/client_form/client_form.component';
import { ClientComponent } from './components/client/client.component';
import { ClientTableComponent } from './components/client/client_table/client_table.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CompanyComponent } from './components/company/company.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ItemComponent } from './components/item/item.component';
import { PaymentComponent } from './components/payment/payment.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';

import {ClientService} from './services/client/client.service';
import { CompanyFormComponent } from './components/company/company-form/company-form.component';
import { DialogComponent } from './components/dialog/dialog.component';
import {ReceiptTableComponent} from './components/receipt/receipt_table/receipt_table.component';
import { LayoutModule } from '@angular/cdk/layout';

import { NavigationComponent } from './components/navigation/navigation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemTableComponent } from './components/item/item_table/item_table.components';
import { ItemFormComponent } from './components/item/item-form/item-form.component';
import { PaymentTableComponent } from './components/payment/payment-table/payment-table.component';
import { PaymentFormComponent } from './components/payment/payment-form/payment-form.component';

import { UserComponent } from './components/user/user.component';
import { InterceptorService } from './services/user/interceptor.service';
import { CompanyTableComponent } from './components/company/company-table/company-table.component';
import { HttpErrorInterceptor } from './services/httperrorinterceptopr.service';


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

    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
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
