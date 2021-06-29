import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { BillingBoardComponent } from 'src/app/components/billing-board/billing-board.component';
import { AddClientComponent } from 'src/app/components/clients/add-client/add-client.component';
import { ClientsComponent } from 'src/app/components/clients/clients.component';
import { ViewClientsComponent } from 'src/app/components/clients/view-clients/view-clients.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { InvoiceComponent } from 'src/app/components/invoice/invoice.component';
import { ParticularsComponent } from 'src/app/components/particulars/particulars.component';
import { PaymentBoardComponent } from 'src/app/components/payment-board/payment-board.component';
import { ReportsComponent } from 'src/app/components/reports/reports.component';
import { SingleClientBoardComponent } from 'src/app/components/single-client-board/single-client-board.component';
import { ViewInvoiceComponent } from 'src/app/components/single-client-board/view-invoice/view-invoice.component';


const routes: Routes = [
  { path: 'new-bill', component: BillingBoardComponent },
  { path: 'new-bill-refersh', component: BillingBoardComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/add', component: AddClientComponent },
  { path: 'clients/view-clients', component: ViewClientsComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/:clientId', component: SingleClientBoardComponent },
  { path: 'clients/:clientId/invoice/:invoiceId', component: ViewInvoiceComponent },
  { path: 'particulars', component: ParticularsComponent },
  { path: 'new-payment', component: PaymentBoardComponent },
  { path: 'new-payment-refersh', component: PaymentBoardComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
