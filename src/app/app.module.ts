import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { RouterModule } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    PrintLayoutComponent,
    InvoiceComponent,
    BillingComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
