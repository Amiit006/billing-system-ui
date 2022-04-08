import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonComponent } from './components/season/season.component';
import { MaterialModule } from '../material/material.module';
import { CreateSeasonComponent } from './components/season/create-season/create-season.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewSeasonComponent } from './components/season/view-season/view-season.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LandingComponent } from './components/landing/landing.component';
import { AddPurchaseComponent } from './components/add-purchase/add-purchase.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [
    SeasonComponent,
    CreateSeasonComponent,
    ViewSeasonComponent,
    PurchasesComponent,
    PaymentsComponent,
    DashboardComponent,
    LandingComponent,
    AddPurchaseComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxChartsModule
  ]
})
export class PurchaseModule { }
