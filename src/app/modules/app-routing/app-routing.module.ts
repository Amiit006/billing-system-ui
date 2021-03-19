import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from 'src/app/components/billing/billing.component';
import { ClientsComponent } from 'src/app/components/clients/clients.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { ReportsComponent } from 'src/app/components/reports/reports.component';


const routes: Routes = [
  { path: 'new-bill', component: BillingComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
