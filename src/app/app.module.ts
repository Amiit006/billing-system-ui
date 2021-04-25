import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { RouterModule } from '@angular/router';
import { BillingComponent } from './components/billing/billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { BillingSummaryComponent } from './components/billing-summary/billing-summary.component';
import { BillingClientComponent } from './components/billing-client/billing-client.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ReportsComponent } from './components/reports/reports.component';
import { IndianCurrencyPipe } from './pipes/indian-currency.pipe';
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './modules/shared/shared.module';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaymentComponent } from './components/payment/payment.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxPrintModule } from 'ngx-print';
import { RowOptnOnHoverComponent } from './components/row-optn-on-hover/row-optn-on-hover.component';
import { ParticularsComponent } from './components/particulars/particulars.component';

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
    IndianCurrencyPipe, RowOptnOnHoverComponent, ParticularsComponent,
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
    NgxPrintModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
