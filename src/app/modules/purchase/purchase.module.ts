// src/app/modules/purchase/purchase.module.ts
// ALTERNATIVE VERSION - Direct Material imports (if MaterialModule has issues)

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ============================================
// DIRECT MATERIAL DESIGN IMPORTS
// ============================================
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';

// Charts Module
import { NgxChartsModule } from '@swimlane/ngx-charts';

// ============================================
// EXISTING COMPONENTS
// ============================================
import { SeasonComponent } from './components/season/season.component';
import { CreateSeasonComponent } from './components/season/create-season/create-season.component';
import { ViewSeasonComponent } from './components/season/view-season/view-season.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LandingComponent } from './components/landing/landing.component';
import { AddPurchaseComponent } from './components/add-purchase/add-purchase.component';

// ============================================
// NEW ENHANCED COMPONENTS
// ============================================

// ============================================
// EXISTING SERVICES
// ============================================
import { PurchaseService } from './services/purchase.service';
import { SeasonService } from './services/season.service';
import { PaymentService } from './services/payment.service';
import { DashboardServiceService } from './services/dashboard-service.service';

// ============================================
// NEW ENHANCED SERVICES
// ============================================
import { EnhancedPurchaseService } from './services/enhanced-purchase.service';
import { ProductService } from './services/product.service';
import { AddProductDialogComponent } from './components/add-purchase/add-product-dialog/add-product-dialog';

@NgModule({
  declarations: [
    // ============================================
    // EXISTING COMPONENTS
    // ============================================
    SeasonComponent,
    CreateSeasonComponent,
    ViewSeasonComponent,
    PurchasesComponent,
    PaymentsComponent,
    DashboardComponent,
    LandingComponent,
    AddPurchaseComponent,
    AddProductDialogComponent
  ],
  imports: [
    // ============================================
    // CORE ANGULAR MODULES
    // ============================================
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    // ============================================
    // MATERIAL DESIGN MODULES (Direct imports)
    // ============================================
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDialogModule,

    // ============================================
    // CHARTS MODULE
    // ============================================
    NgxChartsModule
  ],
  providers: [
    // ============================================
    // EXISTING SERVICES
    // ============================================
    PurchaseService,
    SeasonService,
    PaymentService,
    DashboardServiceService,

    // ============================================
    // NEW ENHANCED SERVICES
    // ============================================
    EnhancedPurchaseService,
    ProductService
  ],
  
  // ============================================
  // ENTRY COMPONENTS (for dialogs - Angular 9+)
  // Note: entryComponents is deprecated in Angular 9+, but keeping for compatibility
  // ============================================
  entryComponents: [
    AddProductDialogComponent,
    PaymentsComponent
  ]
})
export class PurchaseModule { }