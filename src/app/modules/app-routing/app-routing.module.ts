import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { BillingBoardComponent } from 'src/app/components/billing-board/billing-board.component';
import { ClientsComponent } from 'src/app/components/clients/clients.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { InvoiceComponent } from 'src/app/components/invoice/invoice.component';
import { ParticularsComponent } from 'src/app/components/particulars/particulars.component';
import { ReportsComponent } from 'src/app/components/reports/reports.component';


const routes: Routes = [
  { path: 'new-bill', component: BillingBoardComponent },
  { path: 'new-bill-refersh', component: BillingBoardComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'particulars', component: ParticularsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
