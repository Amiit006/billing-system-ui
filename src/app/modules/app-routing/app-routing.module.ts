// src/app/modules/app-routing/app-routing.module.ts - Updated with authentication
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
import { AddPurchaseComponent } from '../purchase/components/add-purchase/add-purchase.component';
import { LandingComponent } from '../purchase/components/landing/landing.component';
import { SeasonComponent } from '../purchase/components/season/season.component';

// Authentication imports
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  // Public routes (no authentication required)
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  // Protected routes (authentication required)
  { 
    path: 'new-bill', 
    component: BillingBoardComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard] 
  },
  { 
    path: 'new-bill-refersh', 
    component: BillingBoardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clients', 
    component: ClientsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clients/add', 
    component: AddClientComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clients/view-clients', 
    component: ViewClientsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clients/:clientId', 
    component: SingleClientBoardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clients/:clientId/invoice/:invoiceId', 
    component: ViewInvoiceComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'particulars', 
    component: ParticularsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'new-payment', 
    component: PaymentBoardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'new-payment-refersh', 
    component: PaymentBoardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports', 
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/sells', 
    component: SellsReportComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/collection', 
    component: CollectionReportComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/tradebook', 
    component: TradeBookComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/client', 
    component: ClientReportComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/particulars', 
    component: ParticularsReportComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/clientOutstanding', 
    component: ClientOutstandingReportComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'invoice', 
    component: InvoiceComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'purchase', 
    component: SeasonComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'purchase/season/:seasonId/addPurchase', 
    component: AddPurchaseComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'purchase/season/:seasonId', 
    component: LandingComponent,
    canActivate: [AuthGuard]
  },
  
  // Dashboard route (protected)
  { 
    path: '', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  
  // Wildcard route - redirect to login if not authenticated, dashboard if authenticated
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }