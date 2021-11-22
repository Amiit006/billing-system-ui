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
import { ClientOutstandingReportComponent } from 'src/app/components/reports/client-outstanding-report/client-outstanding-report.component';
import { ClientReportComponent } from 'src/app/components/reports/client-report/client-report.component';
import { CollectionReportComponent } from 'src/app/components/reports/collection-report/collection-report.component';
import { ParticularsReportComponent } from 'src/app/components/reports/particulars-report/particulars-report.component';
import { ReportsComponent } from 'src/app/components/reports/reports.component';
import { SellsReportComponent } from 'src/app/components/reports/sells-report/sells-report.component';
import { TradeBookComponent } from 'src/app/components/reports/trade-book/trade-book.component';
import { SingleClientBoardComponent } from 'src/app/components/single-client-board/single-client-board.component';
import { ViewInvoiceComponent } from 'src/app/components/single-client-board/view-invoice/view-invoice.component';
import { PendingChangesGuard } from 'src/app/guard/pending-changes.guard';


const routes: Routes = [
  { path: 'new-bill', component: BillingBoardComponent, canDeactivate: [PendingChangesGuard] },
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
  { path: 'reports/sells', component: SellsReportComponent },
  { path: 'reports/collection', component: CollectionReportComponent },
  { path: 'reports/tradebook', component: TradeBookComponent },
  { path: 'reports/client', component: ClientReportComponent },
  { path: 'reports/particulars', component: ParticularsReportComponent },
  { path: 'reports/clientOutstanding', component: ClientOutstandingReportComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
