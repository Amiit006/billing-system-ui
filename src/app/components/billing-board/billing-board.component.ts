import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/guard/pending-changes.guard';
import { BillAmountDetails } from 'src/app/model/bill-amount-details.model';

@Component({
  selector: 'app-billing-board',
  templateUrl: './billing-board.component.html',
  styleUrls: ['./billing-board.component.css']
})
export class BillingBoardComponent implements OnInit, ComponentCanDeactivate  {

  clientForm: FormGroup = this.fb.group({});
  billForm: FormGroup = this.fb.group({});
  paymentForm: FormGroup = this.fb.group({});
  billSettingForm: FormGroup = this.fb.group({});

  billAmountDetails: BillAmountDetails;

  subTotalBillAmount = 0;

  @ViewChild('stepper') private stepper: MatStepper;

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.clientForm.setErrors({ 'incorrect': true });
    this.billForm.setErrors({ 'incorrect': true });
    // this.paymentForm.setErrors({'incorrect': true});
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    if(this.billForm.get("items")?.value?.length > 0) {
      return false;
    }
    else
      return true;
  }

  setClientFormData(event: FormGroup) {
    this.clientForm = event;
  }

  setBillSettingFormData(event: FormGroup) {
    this.billSettingForm = event;
  }

  setBillFormData(event: FormGroup) {
    this.billForm = event;
  }

  setPaymentFormData(event: FormGroup) {
    this.paymentForm = event;
  }

  setSubTotalBillAmount(event) {
    this.subTotalBillAmount = event;
  }

  setBillAmountDetails(event: BillAmountDetails) {
    this.billAmountDetails = event;
  }

  // onPrintBill() {
  //   this.router.navigateByUrl("/invoice", {
  //     state: {
  //       clientForm: this.clientForm,
  //       billFormValue: this.billForm.getRawValue(),
  //       paymentDetails: this.paymentForm,
  //       billAmountDetails: this.billAmountDetails
  //     }
  //   });
  // }

  showNewBill = false;

  setShowNewBill = (event: boolean) => {
    this.showNewBill = event;
  } 

  onReset() {
    this.router.navigateByUrl('/new-bill-refersh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['new-bill']);
    });
  }
}
