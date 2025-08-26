import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AutoViewDirective } from 'src/app/directives/auto-view.directive';
@NgModule({
  declarations: [
    AutoViewDirective
  ],
  imports: [
    CommonModule,
    MaterialModule
  ], exports: [
    AutoViewDirective
  ]
})
export class SharedModule { }
