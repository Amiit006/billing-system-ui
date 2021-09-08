import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { RouterModule } from '@angular/router';
import { BillingComponent } from './components/billing-board/billing/billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { BillingSummaryComponent } from './components/billing-board/billing-summary/billing-summary.component';
import { BillingClientComponent } from './components/billing-board/billing-client/billing-client.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ReportsComponent } from './components/reports/reports.component';
import { IndianCurrencyPipe } from './pipes/indian-currency.pipe';
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './modules/shared/shared.module';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaymentComponent } from './components/billing-board/billing-payment/billing-payment.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxPrintModule } from 'ngx-print';
import { RowOptnOnHoverComponent } from './components/row-optn-on-hover/row-optn-on-hover.component';
import { ParticularsComponent } from './components/particulars/particulars.component';
import { HttpClientModule } from '@angular/common/http';
import { AddParticularComponent } from './components/particulars/add-particular/add-particular.component';
import { ViewParticularsComponent } from './components/particulars/view-particulars/view-particulars.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { ViewClientsComponent } from './components/clients/view-clients/view-clients.component';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BillingBoardComponent } from './components/billing-board/billing-board.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { PaymentBoardComponent } from './components/payment-board/payment-board.component';
import { PaymentSummaryComponent } from './components/payment-board/payment-summary/payment-summary.component';
import { SingleClientBoardComponent } from './components/single-client-board/single-client-board.component';
import { ClientDetailsComponent } from './components/single-client-board/client-details/client-details.component';
import { PaymentDetailsComponent } from './components/single-client-board/payment-details/payment-details.component';
import { InvoiceDetailsComponent } from './components/single-client-board/invoice-details/invoice-details.component';
import { NoResultComponent } from './components/no-result/no-result.component';
import { RoundSpinnerComponent } from './components/round-spinner/round-spinner.component';
import { ViewInvoiceComponent } from './components/single-client-board/view-invoice/view-invoice.component';
import { BillSettingComponent } from './components/billing-board/bill-setting/bill-setting.component';
import { AddDiscountComponent } from './components/single-client-board/add-discount/add-discount.component';
import { PendingChangesGuard } from './guard/pending-changes.guard';

@NgModule({
  declarations: [
    AppComponent,
    PrintLayoutComponent,
    InvoiceComponent,
    BillingComponent,
    HeaderComponent,
    BillingSummaryComponent,
    BillingClientComponent,
    ClientsComponent,
    ReportsComponent,
    DashboardComponent,
    PaymentComponent, 
    IndianCurrencyPipe, RowOptnOnHoverComponent, ParticularsComponent, AddParticularComponent, ViewParticularsComponent, AddClientComponent, ViewClientsComponent, BillingBoardComponent, ProgressSpinnerComponent, PaymentBoardComponent, PaymentSummaryComponent, SingleClientBoardComponent, ClientDetailsComponent, PaymentDetailsComponent, InvoiceDetailsComponent, NoResultComponent, RoundSpinnerComponent, ViewInvoiceComponent, BillSettingComponent, AddDiscountComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    NgxPrintModule,
    HttpClientModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    PendingChangesGuard,
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
