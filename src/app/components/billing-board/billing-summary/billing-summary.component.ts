import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { debounceTime } from 'rxjs/operators';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';
import { BillingService } from 'src/app/services/billing.service';
import { BillingComponent } from '../billing/billing.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-billing-summary',
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.css']
})
export class BillingSummaryComponent implements OnInit, OnChanges {

  @Input() subTotalBill;
  @Input() billSetting;

  subTotalAmount = 0;
  taxAmount = 0;
  taxPercentage = 0;
  overallDiscountPercentage = 0;
  overallDiscountAmount = 0;
  grandTotalAmount = 0;
  operationSymbol = '+';
  roundOffAmount = 0;

  @Input() remarkFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  @Output() billAmountDetails = new EventEmitter<BillAmountDetails>();
  @Output() remarkFormControlData = new EventEmitter<FormControl>();


  constructor(private billingService: BillingService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.billSetting) {
      const stb = changes.billSetting;
      if (stb && stb.currentValue === undefined) {
        this.taxPercentage = 0;
        this.overallDiscountPercentage = 0;
        this.overallDiscountAmount = this.subTotalAmount * this.overallDiscountPercentage / 100;
        this.taxAmount = (this.subTotalAmount - this.overallDiscountAmount) * this.taxPercentage / 100;
        const rounded = this.calculateRoundedTotal(this.subTotalAmount, this.overallDiscountAmount, this.taxAmount);
        this.grandTotalAmount = rounded.total;
        this.roundOffAmount = rounded.roundOff;
        this.operationSymbol = rounded.symbol;
      } else {
        this.taxPercentage = stb.currentValue.taxPercentage;
        this.overallDiscountPercentage = stb.currentValue.overallDiscountPercentage;
        this.overallDiscountAmount = this.subTotalAmount * this.overallDiscountPercentage / 100;
        this.taxAmount = (this.subTotalAmount - this.overallDiscountAmount) * this.taxPercentage / 100;
        const rounded = this.calculateRoundedTotal(this.subTotalAmount, this.overallDiscountAmount, this.taxAmount);
        this.grandTotalAmount = rounded.total;
        this.roundOffAmount = rounded.roundOff;
        this.operationSymbol = rounded.symbol;
      }
    }
    if (changes.subTotalBill) {
      const stb = changes.subTotalBill;
      if (stb.currentValue === undefined) {
        this.subTotalAmount = 0;
        this.taxAmount = 0;
        const rounded = this.calculateRoundedTotal(this.subTotalAmount, this.overallDiscountAmount, this.taxAmount);
        this.grandTotalAmount = rounded.total;
        this.roundOffAmount = rounded.roundOff;
        this.operationSymbol = rounded.symbol;
      } else {
        this.subTotalAmount = stb.currentValue;
        this.taxAmount = (this.subTotalAmount - this.overallDiscountAmount) * this.taxPercentage / 100;
        const rounded = this.calculateRoundedTotal(this.subTotalAmount, this.overallDiscountAmount, this.taxAmount);
        this.grandTotalAmount = rounded.total;
        this.roundOffAmount = rounded.roundOff;
        this.operationSymbol = rounded.symbol;
      }
    }
    var val: BillAmountDetails = {
      subTotalAmount: this.subTotalAmount,
      taxAmount: this.taxAmount,
      taxPercentage: this.taxPercentage,
      overallDiscountPercentage: this.overallDiscountPercentage,
      overallDiscountAmount: this.overallDiscountAmount,
      grandTotalAmount: this.grandTotalAmount,
      roundOffAmount: this.roundOffAmount,
      operationSymbol: this.operationSymbol
    };
    this.billAmountDetails.emit(val);
    this.billingService.setBillAmountDetails(val);
  }

  calculateRoundedTotal(subTotalAmount, overallDiscountAmount, taxAmount) {
    const rawTotal = subTotalAmount - overallDiscountAmount + taxAmount;
    const decimalPart = rawTotal % 1;
    const roundedTotal = decimalPart >= 0.5
        ? Math.ceil(rawTotal)
        : Math.floor(rawTotal);
    
    const roundOff = +(roundedTotal - rawTotal).toFixed(2);
    const symbol = roundOff >= 0 ? '+' : '-';

    return {
        total: roundedTotal,
        roundOff: Math.abs(roundOff),
        symbol: symbol
    };
  }

  ngOnInit(): void {
    this.remarkFormControl.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.remarkFormControlData.emit(this.remarkFormControl);
    })
  }

}
