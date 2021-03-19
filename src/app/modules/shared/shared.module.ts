import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ], exports: [
    PaymentComponent
  ]
})
export class SharedModule { }
