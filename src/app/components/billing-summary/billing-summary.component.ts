import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';
import { BillingComponent } from '../billing/billing.component';

@Component({
  selector: 'app-billing-summary',
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.css']
})
export class BillingSummaryComponent implements OnInit, OnChanges {

  @Input() subTotalBill;

  subTotalAmount = 0;
  taxAmount = 0;
  grandTotalAmount = 0;

  @Output() billAmountDetails = new EventEmitter<BillAmountDetails>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const stb = changes.subTotalBill;
    if(stb.currentValue === undefined) {
      this.subTotalAmount = 0;
      this.taxAmount = 0;
      this.grandTotalAmount = this.subTotalAmount + this.taxAmount;
    } else {
      this.subTotalAmount = stb.currentValue;
      this.taxAmount = this.subTotalAmount * 5 / 100; 
      this.grandTotalAmount = this.subTotalAmount + this.taxAmount;
    }
    var val: BillAmountDetails = {
      subTotalAmount : this.subTotalAmount,
      taxAmount: this.taxAmount,
      taxPercentage: 5,
      grandTotalAmount: this.grandTotalAmount
    };
    this.billAmountDetails.emit(val);
  }

  ngOnInit(): void {

  }

}
